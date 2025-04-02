import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {OrderPage} from "../model/order.model";


const ORDER_URL = environment.baseUrl + '/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) {}

    getOrders(pageNumber: number = 1, pageSize: number = 20): Observable<OrderPage> {
        return this.http.get<OrderPage>(ORDER_URL, {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });
    }
}
