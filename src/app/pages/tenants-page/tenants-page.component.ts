import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-tenants-page',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './tenants-page.component.html',
})
export class TenantsPageComponent {}
