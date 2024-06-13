import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { CreateOrderProductRequest } from 'src/app/models/interfaces/orders_products/request/CreateOrderProductRequest';
import { OrdersProductsService } from 'src/app/services/orders_products/orders-products.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllOrderProductResponse } from 'src/app/models/interfaces/orders_products/response/GetAllOrderProductResponse';
import { OrdersProductsDataTransferService } from 'src/app/shared/services/order_products/order_products-data-transfer.service';
import { OrderProductsEvent } from 'src/app/models/enums/orders_products/OrderProductsEvent';
import { EditOrderProductRequest } from 'src/app/models/interfaces/orders_products/request/EditOrderProductRequest';

@Component({
  selector: 'app-orders-products-form',
  templateUrl: './orders-products-form.component.html',
  styleUrls: []
})
export class OrdersProductsFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public companiesDatas: Array<GetCompaniesResponse> = [];
  public selectedCompany: Array<{ nome: string; code: string }> = [];
  public productsDatas: Array<GetAllProductsResponse> = [];
  public productsDatasByCompanies: Array<GetAllProductsResponse> = [];
  public ordersDatas: Array<GetAllOrderResponse> = [];
  public ordersDatasByCompanies: Array<GetAllOrderResponse> = [];
  public selectedProduct: Array<{ nome: string; code: string }> = [];
  public selectedOrder: Array<{ nome: string; code: string }> = [];
  public orderProductAction!: {
    event: EventAction;
    orderProductDatas: Array<GetAllOrderProductResponse>;
  };
  public orderProductSelectedDatas!: GetAllOrderProductResponse;
  public  ordersProductsDatas: Array<GetAllOrderProductResponse> = [];
  public addOrderProductForm = this.formBuilder.group({
    pedido: ['', Validators.required],
    produto: ['', Validators.required],
    quantidade: ['', Validators.required]
  });
  public editOrderProductForm = this.formBuilder.group({
    quantidade: [0, Validators.required]
  });
  public addOrderProductAction = OrderProductsEvent.ADD_ORDER_PRODUCTS_EVENT;
  public editOrderProductAction = OrderProductsEvent.EDIT_ORDER_PRODUCTS_EVENT;
  public saleOrderProductAction = OrderProductsEvent.SALE_ORDER_PRODUCTS_EVENT;

  constructor(
    private companiesService: CompaniesService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private ordersProductsService: OrdersProductsService,
    private ordersProductsDtService: OrdersProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.orderProductAction = this.ref.data;

    console.log(this.orderProductAction?.event?.action)
    console.log(this.editOrderProductAction)
    console.log(this.orderProductAction?.orderProductDatas)

    if (
      this.orderProductAction?.event?.action === this.editOrderProductAction &&
      this.orderProductAction?.orderProductDatas
    ) {
      this.getOrderProductSelectedDatas(this.orderProductAction?.event?.id as string);
    }

    this.orderProductAction?.event?.action === this.saleOrderProductAction &&
      this.getProductDatas();

    this.getAllProducts();
    this.getAllPedidos();
    this.getAllCompanies();
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
            console.log(this.selectedCompany)
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
            console.log(this.selectedCompany)
            this.ordersDatas = response;
            console.log(this.ordersDatas)
          }
        },
      });
  }

  onCompanyChange(selectedCompanyId: string) {
    this.productsDatasByCompanies = this.productsDatas.filter(obj => selectedCompanyId === obj.empresa)
    this.ordersDatasByCompanies = this.ordersDatas.filter(obj => selectedCompanyId === obj.empresa)
  }

  handleSubmitAddOrderProduct(): void {
    if (this.addOrderProductForm?.value && this.addOrderProductForm?.valid) {
      const requestCreateOrder: CreateOrderProductRequest = {
        pedido: this.addOrderProductForm.value.pedido as string,
        produto: this.addOrderProductForm.value.produto as string,
        quantidade: Number(this.addOrderProductForm.value.quantidade)
      };

      this.ordersProductsService
        .createOrderProduct(requestCreateOrder)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido de produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar pedido de produto!',
              life: 2500,
            });
          },
        });
    }

    this.addOrderProductForm.reset();
  }

  handleSubmitEditOrderProduct(): void {
    if (
      this.editOrderProductForm.value &&
      this.editOrderProductForm.valid &&
      this.orderProductAction.event.id
    ) {
      const requestEditOrderProduct: EditOrderProductRequest = {
        quantidade: this.editOrderProductForm.value.quantidade as number
      };

      this.ordersProductsService
        .editOrderProduct(requestEditOrderProduct, this.orderProductAction?.event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pedido do produto editado com sucesso!',
              life: 2500,
            });
            this.editOrderProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar pedido do produto!',
              life: 2500,
            });
            this.editOrderProductForm.reset();
          },
        });
    }
  }

  getOrderProductSelectedDatas(orderId: string): void {
    const allOrdersProducts = this.orderProductAction?.orderProductDatas;

    console.log(allOrdersProducts)

    if (allOrdersProducts.length > 0) {
      const orderProductFiltered = allOrdersProducts.filter(
        (element) => element?._id === orderId
      );

      console.log(orderProductFiltered)
      console.log(orderId)

      if (orderProductFiltered) {
        this.orderProductSelectedDatas = orderProductFiltered[0];

        console.log(this.orderProductSelectedDatas)

        this.editOrderProductForm.setValue({
          quantidade: this.orderProductSelectedDatas?.quantidade
        });
      }
    }
  }

  getProductDatas(): void {
    this.ordersProductsService
      .getAllOrdersProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.ordersProductsDatas = response;
            this.ordersProductsDatas &&
              this.ordersProductsDtService.setOrdersProductsDatas(this.ordersProductsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
