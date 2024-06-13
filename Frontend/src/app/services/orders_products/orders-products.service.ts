import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CreateOrderProductRequest } from 'src/app/models/interfaces/orders_products/request/CreateOrderProductRequest';
import { CreateOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/CreateOrderProductResponse';
import { DeleteOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/DeleteOrderProductResponse';
import { GetAllOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/GetAllOrderProductResponse';
import { environment } from 'src/environments/environment';
import { EditOrderProductRequest } from 'src/app/models/interfaces/orders_products/request/EditOrderProductRequest';

@Injectable({
  providedIn: 'root'
})
export class OrdersProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllOrdersProducts(): Observable<Array<GetAllOrderProductResponse>> {
    return this.http
      .get<Array<GetAllOrderProductResponse>>(
        `${this.API_URL}/pedidos_produtos`,
        this.httpOptions
      );
  }

  deleteOrderProduct(orderProduct_id: string): Observable<DeleteOrderProductResponse> {
    return this.http.delete<DeleteOrderProductResponse>(
      `${this.API_URL}/pedidos_produtos/${orderProduct_id}`,
      this.httpOptions
    );
  }

  createOrderProduct(
    requestDatas: CreateOrderProductRequest
  ): Observable<CreateOrderProductResponse> {
    return this.http.post<CreateOrderProductResponse>(
      `${this.API_URL}/pedidos_produtos`,
      requestDatas,
      this.httpOptions
    );
  }

  editOrderProduct(requestDatas: EditOrderProductRequest, orderProduct_id: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/pedidos_produtos/${orderProduct_id}`,
      requestDatas,
      this.httpOptions
    );
  }
}
