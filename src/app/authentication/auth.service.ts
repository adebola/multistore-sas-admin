import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenEndpoint = `${environment.authServiceUrl}/oauth2/token`;
    private authorizeEndpoint = `${environment.authServiceUrl}/oauth2/authorize`;
    private clientId = environment.clientId;
    private clientSecret = environment.clientSecret;
    private redirectUri = environment.redirectUri;
    private scope = environment.scope;
    private storeId = environment.storeId;

    constructor(private http: HttpClient, private router: Router) {
    }

    login() {
        const params = new HttpParams()
            .set('response_type', 'code')
            .set('client_id', this.clientId)
            .set('redirect_uri', this.redirectUri)
            .set('scope', this.scope)
            .set('tenant_id', this.storeId);

        const result = window.location.href = `${this.authorizeEndpoint}?${params.toString()}`;
    }

    exchangeCodeForToken(code: string): Observable<any> {
        const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

        const headers = new HttpHeaders({
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const body = new URLSearchParams();
        body.set('grant_type', 'authorization_code');
        body.set('code', code);
        body.set('redirect_uri', this.redirectUri);
        body.set('client_id', this.clientId);
        body.set('client_secret', this.clientSecret);

        return this.http.post<any>(this.tokenEndpoint, body.toString(), {headers: headers});
    }

    refreshAccessToken(refreshToken: string) {
        const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

        const headers = new HttpHeaders({
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);
        body.set('client_id', this.clientId);
        body.set('client_secret', this.clientSecret);

        return this.http.post<any>(this.tokenEndpoint, body.toString(), {headers: headers});
    }
}
