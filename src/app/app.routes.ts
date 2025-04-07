import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import {EditUserComponent} from './pages/users-page/edit-user/edit-user.component';
import { UsersListComponent } from './pages/users-page/users-list/users-list.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import {CallbackComponent} from "./authentication/callback/callback.component";
import {AuthGuard} from "./authentication/auth-guard.service";
import {TenantsPageComponent} from "./pages/tenants-page/tenants-page.component";
import {TenantsListComponent} from "./pages/tenants-page/tenants-list/tenants-list.component";
import {EditTenantComponent} from "./pages/tenants-page/edit-tenant/edit-tenant.component";
import {RolesListComponent} from "./pages/roles-page/roles-list/roles-list.component";
import {RolesPageComponent} from "./pages/roles-page/roles.page.component";
import {EditRoleComponent} from "./pages/roles-page/edit-role/edit-role.component";

export const routes: Routes = [
    {path: '', component: EcommerceComponent, canActivate: [AuthGuard]},
    {path: 'callback', component: CallbackComponent},
    {
        path: 'users',
        canActivate: [AuthGuard],
        component: UsersPageComponent,
        children: [
            {path: '', component: UsersListComponent},
            {path: 'edit/:id', component: EditUserComponent},

        ]
    },
    {
        path: 'roles',
        canActivate: [AuthGuard],
        component: RolesPageComponent,
        children: [
            {path: '', component: RolesListComponent},
            {path: 'new', component: EditRoleComponent},
            {path: 'edit/:id', component: EditRoleComponent},
        ]
    },
    {
        path: 'tenants',
        canActivate: [AuthGuard],
        component: TenantsPageComponent,
        children: [
            {path: '', component: TenantsListComponent},
            {path: 'new', component: EditTenantComponent},
            {path: 'edit/:id', component: EditTenantComponent},
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'logout', component: LogoutComponent},
        ]
    },
    {
        path: 'settings',
        canActivate: [AuthGuard],
        component: SettingsComponent,
        children: [
            {path: '', component: AccountSettingsComponent},
            {path: 'change-password', component: ChangePasswordComponent},
        ]
    },
    {path: 'internal-error', component: InternalErrorComponent},
    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];
