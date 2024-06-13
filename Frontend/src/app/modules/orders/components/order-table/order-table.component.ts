import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderEvent } from 'src/app/models/enums/orders/OrderEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { DeleteOrderAction } from 'src/app/models/interfaces/orders/event/DeleteOrderAction';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: []
})
export class OrderTableComponent {
  @Input() orders: Array<GetAllOrderResponse> = [];
  @Output() orderEvent = new EventEmitter<EventAction>();
  @Output() deleteOrderEvent = new EventEmitter<DeleteOrderAction>();

  public orderSelected!: GetAllOrderResponse;
  public addOrderEvent = OrderEvent.ADD_ORDER_EVENT;
  public editOrderEvent = OrderEvent.EDIT_ORDER_EVENT;

  handleOrderEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const orderEventData = id && id !== '' ? { action, id } : { action };
      this.orderEvent.emit(orderEventData);
    }
  }

  handleDeleteOrder(order_id: string, orderName: string): void {
    if (order_id !== '' && orderName !== '') {
      this.deleteOrderEvent.emit({
        order_id,
        orderName,
      });
    }
  }
}
