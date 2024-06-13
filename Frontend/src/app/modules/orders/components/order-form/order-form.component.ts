import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
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
  public companiesDatas: Array<GetAllCompanyResponse> = [];
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
            this.clientsDatas = response;
          }
        },
      });
  }

  onCompanyChange(selectedCompanyId: string) {
    this.clientsDatasByCompanies = this.clientsDatas.filter(obj => selectedCompanyId === obj.empresa)
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
            this.addOrderForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error.message,
              life: 2500,
            });
          },
        });
    }
  }

  handleSubmitEditOrder(): void {
    if (
      this.editOrderForm.value &&
      this.editOrderForm.valid &&
      this.orderAction.event.id
    ) {
      const requestEditOrder: EditOrderRequest = {
        numero: this.editOrderForm.value.numero as number,
        observacao: this.editOrderForm.value.observacao as string,
        data: this.editOrderForm.value.data as string,
        empresa: this.orderSelectedDatas.empresa as string,
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
              detail: err.error.message,
              life: 2500,
            });
          },
        });
    }
  }

  getOrderSelectedDatas(orderId: string): void {
    const allOrders = this.orderAction?.orderDatas;

    if (allOrders.length > 0) {
      const orderFiltered = allOrders.filter(
        (element) => element?._id === orderId
      );

      if (orderFiltered) {
        this.orderSelectedDatas = orderFiltered[0];

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
