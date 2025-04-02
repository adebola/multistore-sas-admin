import {UserModel} from "../../../shared/model/user.model";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, catchError, finalize, Observable, of, Subscription} from "rxjs";
import {UserService} from "../../../shared/service/user.service";


export class UserDatasource implements DataSource<UserModel> {
    private userSubject = new BehaviorSubject<UserModel[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    private users: UserModel[];

    private subscription: Subscription;

    private pages: number;
    public pageSize: number;
    public pageNumber: number;
    public totalSize: number;

    constructor(private userService: UserService) {}

    get page() {
        if (this.users) {
            return this.pageNumber - 1;
        }

        return 0;
    }

    get length() {
        if (this.users) {
            return this.totalSize;
        }

        return 0;
    }

    connect(collectionViewer: CollectionViewer): Observable<UserModel[]> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    loadUsers(pageIndex = 1, pageSize = 20, searchString: string | null = null) {
        //this.loadingSubject.next(true);

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        let obs$: Observable<any>;

        if (searchString && searchString.length > 0) {
            obs$ = this.userService.search(pageIndex, pageSize, searchString);
        } else {
            obs$ = this.userService.getTenantUsers(pageIndex, pageSize);
        }

        this.subscription = obs$.pipe(
            catchError(() => of(null)),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(page => {
            this.totalSize = page.totalElements
            this.pages = page.totalPages;
            this.pageSize = page.size;
            this.pageNumber = page.pageable.pageNumber;

            this.users = page.content;
            this.userSubject.next(page.content);
        });
    }
}
