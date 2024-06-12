import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateOrderRequest } from 'src/app/models/interfaces/orders/request/CreateOrderRequest';
import { CreateOrderResponse } from 'src/app/models/interfaces/orders/response/CreateOrderResponse';
import { DeleteOrderResponse } from 'src/app/models/interfaces/orders/response/DeleteOrderResponse';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { environment } from 'src/environments/environment';
import { EditOrderRequest } from 'src/app/models/interfaces/orders/request/EditOrderRequest';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private ID_USER = this.cookie.get('USER_ID');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllOrders(): Observable<Array<GetAllOrderResponse>> {
    return this.http
      .get<Array<GetAllOrderResponse>>(
        `${this.API_URL}/pedidos`,
        this.httpOptions
      );
      //.pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteOrder(order_id: string): Observable<DeleteOrderResponse> {
    console.log(order_id);
    return this.http.delete<DeleteOrderResponse>(
      `${this.API_URL}/pedidos/${order_id}`,
      this.httpOptions
    );
  }

  createOrder(
    requestDatas: CreateOrderRequest
  ): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      `${this.API_URL}/pedidos`,
      requestDatas,
      this.httpOptions
    );
  }

  editOrder(requestDatas: EditOrderRequest, order_id: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/pedidos/${order_id}`,
      requestDatas,
      this.httpOptions
    );
  }
}
