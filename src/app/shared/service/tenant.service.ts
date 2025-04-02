import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TenantModel, TenantPage} from "../model/tenant.model";

const TENANT_URL = environment.baseUrl + '/tenant';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    constructor(private http: HttpClient) {}

    getTenants(pageNumber: number = 1, pageSize: number = 20): Observable<TenantPage> {
        return this.http.get<TenantPage>(TENANT_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }

    search(pageNumber: number = 1, pageSize: number = 20, searchString: string): Observable<TenantPage> {
        return this.http.get<TenantPage>(`${TENANT_URL}/search`, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                search: searchString
            }
        });
    }

    getTenantById(id: string): Observable<TenantModel> {
        return this.http.get<TenantModel>(`${TENANT_URL}/${id}`);
    }

    createTenant(tenant: Partial<TenantModel>): Observable<TenantModel> {
        return this.http.post<TenantModel>(TENANT_URL, tenant);
    }

    updateTenant(tenant: Partial<TenantModel>): Observable<TenantModel> {
        return this.http.put<TenantModel>(`${TENANT_URL}/${tenant.id}`, tenant);
    }
}
