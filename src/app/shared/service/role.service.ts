import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthorityModel, AuthorityPage} from "../model/user.model";

const AUTHORITY_URL = environment.baseUrl + '/authority';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private http: HttpClient) {}

    getTenantRoles(pageNumber: number = 1, pageSize: number = 20): Observable<AuthorityPage> {
        return this.http.get<AuthorityPage>(AUTHORITY_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    getAllRoles(pageNumber: number = 1, pageSize: number = 20): Observable<AuthorityPage> {
        return this.http.get<AuthorityPage>(`${AUTHORITY_URL}/admin`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    search(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<AuthorityPage> {
        return this.http.get<AuthorityPage>(`${AUTHORITY_URL}/search`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                search: searchString
            }
        });
    }

    getRoleById(id: string): Observable<AuthorityModel> {
        return this.http.get<AuthorityModel>(`${AUTHORITY_URL}/${id}`);
    }

    createRole(role: Partial<AuthorityModel>): Observable<AuthorityModel> {
        return this.http.post<AuthorityModel>(AUTHORITY_URL, role);
    }

    updateRole(role: Partial<AuthorityModel>): Observable<AuthorityModel> {
        return this.http.put<AuthorityModel>(`${AUTHORITY_URL}/${role.id}`, role);
    }
}
