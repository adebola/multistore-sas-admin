import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel, UserPage} from "../model/user.model";

const USER_URL = environment.baseUrl + '/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    getTenantUsers(pageNumber: number = 1, pageSize: number = 20): Observable<UserPage> {
        return this.http.get<UserPage>(USER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    getAllUsers(pageNumber: number = 1, pageSize: number = 20): Observable<UserPage> {
        return this.http.get<UserPage>(`${USER_URL}/admin`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    search(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<UserPage> {
        return this.http.get<UserPage>(`${USER_URL}/search`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                search: searchString
            }
        });
    }

    uploadImage(id: string,  file: File): Observable<any> {
        const data: FormData = new FormData();
        data.append('file', file);

        return this.http.post(`${USER_URL}/${id}/avatar`, data);
    }

    getUserById(id: string): Observable<UserModel> {
        return this.http.get<UserModel>(`${USER_URL}/${id}`);
    }

    getSelf(): Observable<UserModel> {
        return this.http.get<UserModel>(`${USER_URL}/self`);
    }

    addRolesToUser(id: string, roles: string[]): Observable<any> {
        return this.http.put(`${USER_URL}/${id}/addrole`, {
            roles: roles
        });
    }

    deleteRolesFromUser(id: string, roles: string[]): Observable<any> {
        return this.http.put(`${USER_URL}/${id}/removerole`, {
            roles: roles
        });
    }

    createUser(tenant: Partial<UserModel>): Observable<UserModel> {
        return this.http.post<UserModel>(USER_URL, tenant);
    }

    updateUser(id: string, user: Partial<UserModel>): Observable<UserModel> {
        return this.http.put<UserModel>(`${USER_URL}/${id}`, user);
    }
}
