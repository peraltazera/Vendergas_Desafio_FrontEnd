import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';

@Injectable({
  providedIn: 'root',
})
export class OrdersDataTransferService {
  public ordersDataEmitter$ =
    new BehaviorSubject<Array<GetAllOrderResponse> | null>(null);
  public ordersDatas: Array<GetAllOrderResponse> = [];

  setOrdersDatas(orders: Array<GetAllOrderResponse>): void {
    if (orders) {
      this.ordersDataEmitter$.next(orders);
      this.getOrdersDatas();
    }
  }

  getOrdersDatas() {
    this.ordersDataEmitter$
      .pipe(
        take(1)
        //map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.ordersDatas = response;
          }
        },
      });
      console.log(this.ordersDatas)
    return this.ordersDatas;
  }
}
