import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { CreateOrderRequest } from 'src/app/models/interfaces/orders/request/CreateOrderRequest';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { OrdersDataTransferService } from 'src/app/shared/services/orders/orders-data-transfer.service';
import { OrderEvent } from 'src/app/models/enums/orders/OrderEvent';
import { EditOrderRequest } from 'src/app/models/interfaces/orders/request/EditOrderRequest';
import {ClientsService } from '../../../../services/clients/clients.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: []
})
export class OrderFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public companiesDatas: Array<GetCompaniesResponse> = [];
  public clientsDatas: Array<GetAllClientResponse> = [];
  public clientsDatasByCompanies: Array<GetAllClientResponse> = [];
  public selectedCompany: Array<{ nome: string; code: string }> = [];
  public selectedClient: Array<{ nome: string; code: string }> = [];
  public orderAction!: {
    event: EventAction;
    orderDatas: Array<GetAllOrderResponse>;
  };
  public orderSelectedDatas!: GetAllOrderResponse;
  public  ordersDatas: Array<GetAllOrderResponse> = [];
  public addOrderForm = this.formBuilder.group({
    numero: ['', Validators.required],
    cliente: ['', Validators.required],
    empresa: ['', Validators.required],
    observacao: ['', Validators.required],
    data: ['', Validators.required],
  });
  public editOrderForm = this.formBuilder.group({
    numero: [0, Validators.required],
    observacao: ['', Validators.required],
    data: ['', Validators.required],
  });
  public addOrderAction = OrderEvent.ADD_ORDER_EVENT;
  public editOrderAction = OrderEvent.EDIT_ORDER_EVENT;
  public saleOrderAction = OrderEvent.SALE_ORDER_EVENT;

  constructor(
    private companiesService: CompaniesService,
    private clientsService: ClientsService,
    private ordersService: OrdersService,
    private ordersDtService: OrdersDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.orderAction = this.ref.data;

    console.log(this.orderAction?.event?.action)
    console.log(this.editOrderAction)
    console.log(this.orderAction?.orderDatas)

    if (
      this.orderAction?.event?.action === this.editOrderAction &&
      this.orderAction?.orderDatas
    ) {
      this.getOrderSelectedDatas(this.orderAction?.event?.id as string);
    }

    this.orderAction?.event?.action === this.saleOrderAction &&
      this.getProductDatas();

    this.getAllClients();
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

  getAllClients(): void {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            console.log(this.selectedCompany)
            this.clientsDatas = response;
            console.log(this.clientsDatas)
          }
        },
      });
  }

  onCompanyChange(): void {
    console.log(this.selectedCompany)
    //this.clientsDatasByCompanies = this.clientsDatas.filter(obj => this.selectedCompany = obj._id)
  }

  onCompanyChange2(selectedCompanyId: string) {
    console.log(selectedCompanyId)
    console.log(this.clientsDatas)
    this.clientsDatasByCompanies = this.clientsDatas.filter(obj => selectedCompanyId === obj.empresa)
    console.log(this.clientsDatasByCompanies)
  }

  handleSubmitAddOrder(): void {
    if (this.addOrderForm?.value && this.addOrderForm?.valid) {
      const requestCreateOrder: CreateOrderRequest = {
        numero: Number(this.addOrderForm.value.numero),
        cliente: this.addOrderForm.value.cliente as string,
        empresa: this.addOrderForm.value.empresa as string,
        observacao: this.addOrderForm.value.observacao as string,
        data: this.addOrderForm.value.data as string
      };

      this.ordersService
        .createOrder(requestCreateOrder)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar pedido!',
              life: 2500,
            });
          },
        });
    }

    this.addOrderForm.reset();
  }

  handleSubmitEditOrder(): void {
    if (
      this.editOrderForm.value &&
      this.editOrderForm.valid &&
      this.orderAction.event.id
    ) {
      const requestEditOrder: EditOrderRequest = {
        numero: Number(this.addOrderForm.value.numero),
        observacao: this.editOrderForm.value.observacao as string,
        data: this.editOrderForm.value.data as string,
      };

      this.ordersService
        .editOrder(requestEditOrder, this.orderAction?.event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pedido editado com sucesso!',
              life: 2500,
            });
            this.editOrderForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editOrderForm.reset();
          },
        });
    }
  }

  getOrderSelectedDatas(orderId: string): void {
    const allOrders = this.orderAction?.orderDatas;

    console.log(allOrders)

    if (allOrders.length > 0) {
      const orderFiltered = allOrders.filter(
        (element) => element?._id === orderId
      );

      console.log(orderFiltered)
      console.log(orderId)

      if (orderFiltered) {
        this.orderSelectedDatas = orderFiltered[0];

        console.log(this.orderSelectedDatas)

        this.editOrderForm.setValue({
          numero: this.orderSelectedDatas?.numero,
          observacao: this.orderSelectedDatas?.observacao,
          data: this.orderSelectedDatas?.data,
        });
      }
    }
  }

  getProductDatas(): void {
    this.ordersService
      .getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.ordersDatas = response;
            this.ordersDatas &&
              this.ordersDtService.setOrdersDatas(this.ordersDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
