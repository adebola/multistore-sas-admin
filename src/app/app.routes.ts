import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import {EditUserComponent} from './pages/users-page/edit-user/edit-user.component';
import { UsersListComponent } from './pages/users-page/users-list/users-list.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { InvoiceDetailsComponent } from './pages/invoices-page/invoice-details/invoice-details.component';
import { InvoicesComponent } from './pages/invoices-page/invoices/invoices.component';
import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';
import { EReviewsComponent } from './pages/ecommerce-page/e-reviews/e-reviews.component';
import { EEditCategoryComponent } from './pages/ecommerce-page/e-edit-category/e-edit-category.component';
import { ECreateCategoryComponent } from './pages/ecommerce-page/e-create-category/e-create-category.component';
import { ECategoriesComponent } from './pages/ecommerce-page/e-categories/e-categories.component';
import { ERefundsComponent } from './pages/ecommerce-page/e-refunds/e-refunds.component';
import { ECreateSellerComponent } from './pages/ecommerce-page/e-create-seller/e-create-seller.component';
import { ESellerDetailsComponent } from './pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { ESellersComponent } from './pages/ecommerce-page/e-sellers/e-sellers.component';
import { EOrderDetailsComponent } from './pages/ecommerce-page/e-order-details/e-order-details.component';
import { EOrdersComponent } from './pages/ecommerce-page/e-orders/e-orders.component';
import { EEditProductComponent } from './pages/ecommerce-page/e-edit-product/e-edit-product.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
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
        path: 'product',
        component: EcommercePageComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: EProductsListComponent},
            {path: 'product-details', component: EProductDetailsComponent},
            {path: 'create-product', component: ECreateProductComponent},
            {path: 'edit-product', component: EEditProductComponent},
            {path: 'categories', component: ECategoriesComponent},
            {path: 'create-category', component: ECreateCategoryComponent},
            {path: 'edit-category', component: EEditCategoryComponent},
            {path: 'refunds', component: ERefundsComponent},
            {path: 'reviews', component: EReviewsComponent}
        ]
    },
    {
      path: 'order',
        canActivate: [AuthGuard],
        component: EcommercePageComponent,
        children: [
            {path: '', component: EOrdersComponent},
            {path: 'create', component: EOrderDetailsComponent},
            {path: 'details', component: EOrderDetailsComponent},
        ]
    },
    {
        path: 'vendors',
        canActivate: [AuthGuard],
        component: EcommercePageComponent,
        children: [
            {path: '', component: ESellersComponent},
            {path: 'seller-details', component: ESellerDetailsComponent},
            {path: 'create-seller', component: ECreateSellerComponent},
        ]
    },
    {
        path: 'invoices',
        canActivate: [AuthGuard],
        component: InvoicesPageComponent,
        children: [
            {path: '', component: InvoicesComponent},
            {path: 'invoice-details', component: InvoiceDetailsComponent},
        ]
    },
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
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
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
