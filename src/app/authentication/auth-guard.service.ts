import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    /*
     Determine if the user is logged On or not, if they are logged in
     allow them to navigate to the requested route, otherwise
     redirect them to the authentication page
    */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            return true;
        }

        return this.router.createUrlTree(['/authentication/logout']);
    }
}
