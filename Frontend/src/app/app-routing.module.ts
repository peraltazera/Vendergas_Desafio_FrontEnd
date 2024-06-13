import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.module').then(
        (m) => m.ProductsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'companies',
    loadChildren: () =>
      import('./modules/companies/companies.module').then(
        (m) => m.CompaniesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./modules/clients/clients.module').then(
        (m) => m.ClientsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./modules/orders/orders.module').then(
        (m) => m.OrdersModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ordersProducts',
    loadChildren: () =>
      import('./modules/orders-products/orders-products.module').then(
        (m) => m.OrdersProductsModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

