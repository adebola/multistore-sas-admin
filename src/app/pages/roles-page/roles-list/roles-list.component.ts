import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {debounceTime, distinctUntilChanged, fromEvent, Subscription, tap} from "rxjs";
import {CustomizerSettingsService} from "../../../customizer-settings/customizer-settings.service";
import {RoleService} from "../../../shared/service/role.service";
import {RoleDatasource} from "./role.datasource";

@Component({
    selector: 'app-roles-list',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
    ],
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'roleName', 'action'];
    dataSource : RoleDatasource;
    subscription: Subscription;

    // isToggled
    isToggled = false;

    @ViewChild('input') input: ElementRef;
    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
        private roleService: RoleService,
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        this.dataSource = new RoleDatasource(this.roleService);
        this.dataSource.loadRoles();
    }

    ngAfterViewInit() {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 1;
                    this.dataSource.loadRoles(
                        this.paginator.pageIndex,
                        this.paginator.pageSize,
                        this.input.nativeElement.value
                    );
                })
            ).subscribe();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    logEvent($event: PageEvent) {
        this.dataSource.loadRoles($event.pageIndex + 1, $event.pageSize);
    }
}
