import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-users-page',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './users-page.component.html',
})
export class UsersPageComponent {}
