import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdersProductsService } from '../../../../services/orders_products/orders-products.service';
import { OrdersProductsDataTransferService } from 'src/app/shared/services/order_products/order_products-data-transfer.service';
import { GetAllOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/GetAllOrderProductResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdersProductsFormComponent } from '../../components/orders-products-form/orders-products-form.component';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-orders-products-home',
  templateUrl: './orders-products-home.component.html',
  styleUrls: []
})
export class OrdersProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public OrdersProductsDatas: Array<GetAllOrderProductResponse> = [];
  public companiesDatas: Array<GetCompaniesResponse> = [];
  public productsDatas: Array<GetAllProductsResponse> = [];
  public ordersDatas: Array<GetAllOrderResponse> = [];
  public selectedProduct: Array<{ nome: string; code: string }> = [];
  public selectedOrder: Array<{ nome: string; code: string }> = [];

  constructor(
    private companiesService: CompaniesService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private ordersProductsService: OrdersProductsService,
    private ordersProductsDtService: OrdersProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllPedidos();
    this.getAllCompanies();
    this.getServiceOrdersProductsDatas();
  }

  getAllCompanies(): void {
    this.companiesService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.companiesDatas = response;
            console.log(this.companiesDatas)
          }
        },
      });
  }

  getAllProducts(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            console.log(this.productsDatas)
          }
        },
      });
  }

  getAllPedidos(): void {
    this.ordersService
      .getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.ordersDatas = response;
            console.log(this.ordersDatas)
          }
        },
      });
  }

  getServiceOrdersProductsDatas() {
    const ordersProductsLoaded = this.ordersProductsDtService.getOrdersProductsDatas();

    if (ordersProductsLoaded.length > 0) {
      this.OrdersProductsDatas = ordersProductsLoaded;
      console.log(this.OrdersProductsDatas)
    } else this.getAPIOrdersProductsDatas();

  }

  getAPIOrdersProductsDatas() {
    this.ordersProductsService
      .getAllOrdersProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.OrdersProductsDatas = response

            this.OrdersProductsDatas.map(obj => {
              let order = this.ordersDatas.find(comp => comp._id === obj.pedido);
              console.log(order)
              if (order) {
                obj.pedidoNumero = order.numero;
              }
            });

            this.OrdersProductsDatas.map(obj => {
              let product = this.productsDatas.find(cli=> cli._id === obj.produto);
              console.log(product)
              if (product) {
                obj.produtoNome = product.nome;
              }
            });

            console.log(this.OrdersProductsDatas)
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar pedido de produto',
            life: 2500,
          });
          this.router.navigate(['/products']);
        },
      });
  }

  handleOrderProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(OrdersProductsFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          orderProductDatas: this.OrdersProductsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIOrdersProductsDatas(),
      });
    }
  }

  handleDeleteOrderProductAction(event: {
    orderProduct_id: string;
    orderProductName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do pedido de produto: ${event?.orderProductName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteOrderProduct(event?.orderProduct_id),
      });
    }
  }

  deleteOrderProduct(orderProduct_id: string) {
    if (orderProduct_id) {
      this.ordersProductsService
        .deleteOrderProduct(orderProduct_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido de produto removido com sucesso!',
                life: 2500,
              });

              this.getAPIOrdersProductsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover pedido de produto!',
              life: 2500,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
