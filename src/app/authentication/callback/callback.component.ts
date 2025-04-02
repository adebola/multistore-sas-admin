import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
    standalone: true,
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            this.authService.exchangeCodeForToken(code)
                .subscribe(
                    (tokens) => {
                        localStorage.setItem('access_token', tokens.access_token);
                        localStorage.setItem('refresh_token', tokens.refresh_token);
                        this.router.navigate(['/']).then(r => console.log(`Saving access token to localStorage ${tokens.access_token}`));
                    },
                    (error) => console.log(`Error in exchangeCodeForToken message: ${error.message} code: ${error.code} error: ${error.error}`),
                    () => console.log('exchangeCodeForToken completed')
                );
        }
    }
}
