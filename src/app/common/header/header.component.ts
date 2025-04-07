import {AsyncPipe, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import {Component, HostListener, OnInit} from '@angular/core';
import { ToggleService } from '../sidebar/toggle.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import {UserModel} from "../../shared/model/user.model";
import {Observable} from "rxjs";
import {UserService} from "../../shared/service/user.service";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        NgClass,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        NgIf,
        AsyncPipe,
        NgOptimizedImage
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    public user$: Observable<UserModel>;

    // isSidebarToggled
    isSidebarToggled = false;

    // isToggled
    isToggled = false;

    constructor(
        private userService: UserService,
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService
    ) {
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Burger Menu Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // Header Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    ngOnInit(): void {
        this.user$ = this.userService.getSelf();
    }
}
