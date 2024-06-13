import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderProductsEvent } from 'src/app/models/enums/orders_products/OrderProductsEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/GetAllOrderProductResponse';
import { DeleteOrderProductAction } from 'src/app/models/interfaces/orders_products/event/DeleteOrderProductAction';

@Component({
  selector: 'app-orders-products-table',
  templateUrl: './orders-products-table.component.html',
  styleUrls: []
})
export class OrdersProductsTableComponent {
  @Input() ordersProducts: Array<GetAllOrderProductResponse> = [];
  @Output() orderProductEvent = new EventEmitter<EventAction>();
  @Output() deleteOrderProductEvent = new EventEmitter<DeleteOrderProductAction>();

  public orderProductSelected!: GetAllOrderProductResponse;
  public addOrderProductEvent = OrderProductsEvent.ADD_ORDER_PRODUCTS_EVENT;
  public editOrderProductEvent = OrderProductsEvent.EDIT_ORDER_PRODUCTS_EVENT;

  handleOrderProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const orderProductEventData = id && id !== '' ? { action, id } : { action };
      this.orderProductEvent.emit(orderProductEventData);
    }
  }

  handleDeleteOrderProduct(orderProduct_id: string, orderProductName: string): void {
    if (orderProduct_id !== '' && orderProductName !== '') {
      this.deleteOrderProductEvent.emit({
        orderProduct_id,
        orderProductName,
      });
    }
  }
}
