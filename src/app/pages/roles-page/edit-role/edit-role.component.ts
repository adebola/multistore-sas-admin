import {Component, DestroyRef, inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, catchError, finalize, Subscription, throwError} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {CustomizerSettingsService} from "../../../customizer-settings/customizer-settings.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthorityModel} from "../../../shared/model/user.model";
import {RoleService} from "../../../shared/service/role.service";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-edit-role',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
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
        AsyncPipe,
        MatProgressSpinner,
        RouterLink,
    ],
    templateUrl: './edit-role.component.html',
    styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit, OnDestroy {
    roleForm: FormGroup;
    role: AuthorityModel;
    isToggled = false;
    private subscription: Subscription;
    private routeSubscription: Subscription;
    public id: string;

    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private destroyRef = inject(DestroyRef);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private roleService: RoleService,
        private snackBarService: SnackbarService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params.subscribe(params => {
            this.id = params['id'];

            if (this.id) {
                this.subscription = this.roleService.getRoleById(this.id).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error Loading Role';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(role => {
                    this.role = role;
                    console.log('ROLE',this.role);
                    this.createEditForm();
                });
            } else {
                this.createNewForm();
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    createNewForm(): void {
        this.roleForm = this.fb.group({
            authority: [null, Validators.required],
            description: [null, Validators.required],
            disabled: [false],
        });
    }

    createEditForm(): void {
        console.log(this.role.authority);
        this.roleForm = this.fb.group({
            id: [this.role.id],
            authority: [this.role.authority, Validators.required],
            description: [this.role.description, Validators.required],
            disabled: [false],
        });
    }

    onSubmit(roleForm: FormGroup): void {
        this.loadingSubject.next(true);

        if (this.id) {
            if (this.roleForm.valid) {
                // const updatedRole = { ...this.role, ...this.roleForm.value };
                // updatedRole.id = null;
                this.subscription = this.roleService.updateRole(this.id, {
                    authority: roleForm.value.authority,
                    description: roleForm.value.description,
                }).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => { this.loadingSubject.next(false) }),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error saving Role updates';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(tenantForm => {
                    this.snackBarService.message('Role updated successfully');
                    this.router.navigate(['/roles']);
                });
            }
        } else {
            if (this.roleForm.valid) {
                this.subscription = this.roleService.createRole(this.roleForm.value).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => { this.loadingSubject.next(false) }),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error creating Role';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(tenantForm => {
                    this.snackBarService.message('Tenant created successfully');
                    this.router.navigate(['/roles']);
                });
            }
        }
    }

    goBack() {
        this.router.navigate(['/roles']);
    }
}
