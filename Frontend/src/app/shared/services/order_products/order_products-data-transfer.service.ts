import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/GetAllOrderProductResponse';

@Injectable({
  providedIn: 'root',
})
export class OrdersProductsDataTransferService {
  public ordersProductsDataEmitter$ =
    new BehaviorSubject<Array<GetAllOrderProductResponse> | null>(null);
  public ordersProductsDatas: Array<GetAllOrderProductResponse> = [];

  setOrdersProductsDatas(ordersProducts: Array<GetAllOrderProductResponse>): void {
    if (ordersProducts) {
      this.ordersProductsDataEmitter$.next(ordersProducts);
      this.getOrdersProductsDatas();
    }
  }

  getOrdersProductsDatas() {
    this.ordersProductsDataEmitter$
      .pipe(
        take(1)
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.ordersProductsDatas = response;
          }
        },
      });
      console.log(this.ordersProductsDatas)
    return this.ordersProductsDatas;
  }
}
