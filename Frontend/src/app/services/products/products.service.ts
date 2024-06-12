import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { environment } from 'src/environments/environment';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
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

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/produtos`,
        this.httpOptions
      );
      //.pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteProduct(product_id: string): Observable<DeleteProductResponse> {
    console.log(product_id);
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/produtos/${product_id}`,
      this.httpOptions
    );
  }

  createProduct(
    requestDatas: CreateProductRequest
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/produtos`,
      requestDatas,
      this.httpOptions
    );
  }

  editProduct(requestDatas: EditProductRequest, product_id: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/produtos/${product_id}`,
      requestDatas,
      this.httpOptions
    );
  }
}