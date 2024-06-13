import { Routes } from '@angular/router';
import { OrdersHomeComponent } from './page/orders-home/orders-home.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersHomeComponent,
  },
];
