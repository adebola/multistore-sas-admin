import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, catchError, finalize, Observable, of, Subscription} from "rxjs";
import {RoleService} from "../../../shared/service/role.service";
import {AuthorityModel} from "../../../shared/model/user.model";


export class RoleDatasource implements DataSource<AuthorityModel> {
    private authoritySubject = new BehaviorSubject<AuthorityModel[]>([]);
    private roles: AuthorityModel[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private roleService: RoleService) {}

    get page() {
        if (this.roles) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {
        if (this.roles) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<AuthorityModel[]> {
        return this.authoritySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.authoritySubject.complete();
    }

    loadRoles(pageIndex = 1, pageSize = 20, searchString: string | null = null) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.roleService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.roleService.getTenantRoles(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
        ).subscribe(page => {
            this.totalSize = page.totalElements
            this.pages = page.totalPages;
            this.pageSize = page.size;
            this.pageNumber = page.pageable.pageNumber;

            this.roles = page.content;
            this.authoritySubject.next(page.content);
        });
    }
}
