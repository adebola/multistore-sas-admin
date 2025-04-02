import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import { TenantService } from '../../../shared/service/tenant.service';
import { TenantModel } from '../../../shared/model/tenant.model';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import {CustomizerSettingsService} from "../../../customizer-settings/customizer-settings.service";
import {BehaviorSubject, catchError, finalize, Subscription, throwError} from "rxjs";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-edit-tenant',
    templateUrl: './edit-tenant.component.html',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        RouterLink,
        RouterModule,
        NgIf,
        AsyncPipe,
        MatProgressSpinner
    ],
    styleUrls: ['./edit-tenant.component.scss'],
    providers: [DatePipe]
})
export class EditTenantComponent implements OnInit, OnDestroy {
    tenantForm: FormGroup;
    tenant: TenantModel;
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
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private tenantService: TenantService,
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
                this.subscription = this.tenantService.getTenantById(this.id).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error Loading Tenant';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(tenant => {
                    this.tenant = tenant;
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
        this.tenantForm = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
            secret:[null, Validators.required],
            disabled: [false, Validators.required],
        });
    }

    createEditForm(): void {
        this.tenantForm = this.fb.group({
            id: [this.tenant.id],
            name: [this.tenant.name, Validators.required],
            description: [this.tenant.description, Validators.required],
            createdBy: [this.tenant.createdBy],
            createdOn: [this.datePipe.transform(this.tenant.createdAt, 'dd-MM-yyyy HH:mm')],
            secret:[''],
            disabled: [this.tenant.disabled]
        });
    }

    onSubmit(tenantForm: FormGroup): void {
        this.loadingSubject.next(true);

        if (this.id) {
            if (this.tenantForm.valid) {
                const updatedTenant = { ...this.tenant, ...this.tenantForm.value };
                this.subscription = this.tenantService.updateTenant(updatedTenant).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => { this.loadingSubject.next(false) }),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error saving Tenant updates';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(tenantForm => {
                    this.snackBarService.message('Tenant updated successfully');
                    this.router.navigate(['/tenants']);
                });
            }
        } else {
            if (this.tenantForm.valid) {
                this.subscription = this.tenantService.createTenant(this.tenantForm.value).pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => { this.loadingSubject.next(false) }),
                    catchError((error: HttpErrorResponse) => {
                        const message = 'Error creating Tenant';
                        this.snackBarService.message(message);
                        return throwError(() => new Error(message));
                    })
                ).subscribe(tenantForm => {
                    this.snackBarService.message('Tenant created successfully');
                    this.router.navigate(['/tenants']);
                });
            }
        }
    }

    goBack() {
        this.router.navigate(['/tenants']);
    }
}
