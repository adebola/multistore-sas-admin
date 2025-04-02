import {Component, DestroyRef, Inject, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CustomizerSettingsService} from '../../../customizer-settings/customizer-settings.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AuthorityModel, UserModel} from "../../../shared/model/user.model";
import {BehaviorSubject, catchError, finalize, Subscription, throwError} from "rxjs";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {UserService} from "../../../shared/service/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIcon} from "@angular/material/icon";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {RoleService} from "../../../shared/service/role.service";

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FileUploadModule,
        MatRadioModule,
        MatCheckboxModule,
        NgIf,
        NgOptimizedImage,
        MatProgressSpinner,
        AsyncPipe,
        MatIcon,
        MatListOption,
        MatSelectionList,
        NgForOf,
    ],
    providers: [DatePipe],
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit, OnDestroy {
    private id: string;
    public userForm: FormGroup;
    private subscription: Subscription;

    // isToggled
    isToggled = false;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    userSubject = new BehaviorSubject<Partial<UserModel>>({});
    public user$ = this.userSubject.asObservable();

    private destroyRef = inject(DestroyRef);

    public assignedRoles: AuthorityModel[] = [];
    public assignableRoles: AuthorityModel[] = [];
    public allRoles: AuthorityModel[] = [];

    @ViewChild('assign') assignSelectionList: MatSelectionList;
    @ViewChild('remove') removeSelectionList: MatSelectionList;

    ngOnInit(): void {
        this.id = <string>this.route.snapshot.paramMap.get('id');
        this.subscription = this.userService.getUserById(this.id).subscribe(u => {
            this.userSubject.next(u);

            // Get All Roles
            this.roleService.getAllRoles().pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe(r => {
                this.allRoles = r.content;
                // Filter out assigned roles from assignable roles
                const ids = u.authorities.map(role => role.id);
                this.assignedRoles = u.authorities;
                this.assignableRoles = r.content.filter(role => !ids.includes(role.id));
                this.createForm(u);
            });
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
        this.loadingSubject.complete();
        this.userSubject.complete();
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Inject(FormBuilder) private fb: FormBuilder,
        private userService: UserService,
        private roleService: RoleService,
        private datePipe: DatePipe,
        private snackService: SnackbarService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    onFileChange($event: Event) {
        const element = $event.target as HTMLInputElement;
        const file = element.files ? element.files[0] : null;

        if (file) {
            this.loadingSubject.next(true);

            this.userService.uploadImage(this.id, file).pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.loadingSubject.next(false)
                }),
                catchError((error: HttpErrorResponse) => {
                    const message = 'Error uploading file make sure it is an image file and not larger than 2MB';
                    this.snackService.message(message);
                    return throwError(() => new Error(message));
                })
            ).subscribe(result => {
                this.snackService.message('Image uploaded successfully');
                this.loadUser();
            });
        }
    }

    private loadUser() {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = this.userService.getUserById(this.id).subscribe(u => {
            this.userSubject.next(u);
        });
    }

    private loadRoles() {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = this.userService.getUserById(this.id).subscribe(u => {
            const ids = u.authorities.map(role => role.id);
            this.assignedRoles = u.authorities;
            this.assignableRoles = this.allRoles.filter(role => !ids.includes(role.id));
        });
    }

    private createForm(u: UserModel) {
        this.userForm = this.fb.group({
            id: [u.id],
            name: [u.userName],
            firstname: [u.firstName, Validators.required],
            lastname: [u.lastName, Validators.required],
            createdOn: [this.datePipe.transform(u.createdOn, 'dd-MM-yyyy HH:mm')],
            email: [u.email],
            disabled: [false],
        });
    }

    onSubmit(userForm: FormGroup) {
        if (userForm.invalid) {
            return this.snackService.message('Please fill all required fields');
        }

        const firstName = this.userForm.value.firstname;
        const lastName = this.userForm.value.lastname;

        //const firstName = userForm.get('firstname')?.value;

        this.loadingSubject.next(true);
        this.userService.updateUser(this.id, {
            firstName: firstName,
            lastName: lastName,
        }).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => { this.loadingSubject.next(false) }),
            catchError((error: HttpErrorResponse) => {
                const message = 'Error saving User updates';
               this.snackService.message(message);
                return throwError(() => new Error(message));
            })
        ).subscribe(u => this.snackService.message('User updated successfully'));
    }

    goBack() {
        this.router.navigate(['/users']).then(r => {
        });
    }

    assignRoles() {
        const selectedRoles = this.assignSelectionList.selectedOptions.selected.map((role: MatListOption) => role.value);
        if (selectedRoles.length <= 0) {
            return this.snackService.message('Please select a role to assign');
        }

        this.userService.addRolesToUser(this.id, selectedRoles.map(s => s.id)).subscribe(a => {
            this.snackService.message('Roles assigned successfully');
            this.assignSelectionList.deselectAll();
            this.loadRoles();
        });
    }

    removeRoles() {
        const selectedRoles = this.removeSelectionList.selectedOptions.selected.map((role: MatListOption) => role.value);

        if (selectedRoles.length <= 0) {
            return this.snackService.message('Please select a role to revoke');
        }

        this.userService.deleteRolesFromUser(this.id, selectedRoles.map(s => s.id)).subscribe(a => {
            this.snackService.message('Roles removed successfully');
            this.loadRoles();
        });
    }
}
