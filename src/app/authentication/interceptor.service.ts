import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.endsWith('/oauth2/token')) {
            return next.handle(req);
        }

        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken) {
            console.log('TokenInterceptorService: intercept: accessToken: ' + accessToken);
            req = req.clone({
                setHeaders: {Authorization: `Bearer ${accessToken}`, 'X-TenantID': environment.storeId},
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && refreshToken) {
                    return this.authService.refreshAccessToken(refreshToken).pipe(
                        switchMap((tokens) => {
                            localStorage.setItem('access_token', tokens.access_token);
                            req = req.clone({
                                setHeaders: {Authorization: `Bearer ${tokens.access_token}`},
                            });
                            return next.handle(req);
                        }),
                        catchError((refreshError: HttpErrorResponse) => {
                            this.router.navigate(['/authentication/logout']).then(r => console.log(r));
                            return throwError(() => new Error('Unauthorized'));
                        })
                    );
                } else {
                    if (error.status === 401) {
                        this.router.navigate(['/authentication/logout']).then(r => console.log(r));
                    }

                    return throwError(() => new Error('Unauthorized'));
                }
            })
        );
    }
}
