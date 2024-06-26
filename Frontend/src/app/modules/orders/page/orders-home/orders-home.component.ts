import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdersService } from '../../../../services/orders/orders.service';
import { OrdersDataTransferService } from 'src/app/shared/services/orders/orders-data-transfer.service';
import { GetAllOrderResponse } from 'src/app/models/interfaces/orders/response/GetAllOrderResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderFormComponent } from '../../components/order-form/order-form.component';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import {ClientsService } from '../../../../services/clients/clients.service';

@Component({
  selector: 'app-orders-home',
  templateUrl: './orders-home.component.html',
  styleUrls: []
})
export class OrdersHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public ordersDatas: Array<GetAllOrderResponse> = [];
  public companiesDatas: Array<GetAllCompanyResponse> = [];
  public clientsDatas: Array<GetAllClientResponse> = [];

  constructor(
    private companiesService: CompaniesService,
    private clientsService: ClientsService,
    private ordersService: OrdersService,
    private ordersDtService: OrdersDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllCompanies();
    this.getAllClients();
    this.getServiceOrdersDatas();
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

  getAllClients() {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            const idCompanies = new Set(this.companiesDatas.map(e => e._id));
            this.clientsDatas = response.filter(obj => idCompanies.has(obj.empresa));
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message,
            life: 2500,
          });
          this.router.navigate(['/clients']);
        },
      });
  }


  getServiceOrdersDatas() {
    const ordersLoaded = this.ordersDtService.getOrdersDatas();

    if (ordersLoaded.length > 0) {
      this.ordersDatas = ordersLoaded;
    } else this.getAPIOrdersDatas();

  }

  getAPIOrdersDatas() {
    this.ordersService
      .getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            const idCompanies = new Set(this.companiesDatas.map(e => e._id));
            this.ordersDatas = response.filter(obj => idCompanies.has(obj.empresa));

            this.ordersDatas.map(obj => {
              let company = this.companiesDatas.find(comp => comp._id === obj.empresa);
              if (company) {
                obj.empresaNome = company.nomeFantasia;
              }
            });

            this.ordersDatas.map(obj => {
              let client = this.clientsDatas.find(cli=> cli._id === obj.cliente);
              if (client) {
                obj.clienteNome = client.nome;
              }
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message,
            life: 2500,
          });
          this.router.navigate(['/products']);
        },
      });
  }

  handleOrderAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(OrderFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          orderDatas: this.ordersDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIOrdersDatas(),
      });
    }
  }

  handleDeleteOrderAction(event: {
    order_id: string;
    orderName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do pedido: ${event?.orderName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteOrder(event?.order_id),
      });
    }
  }

  deleteOrder(order_id: string) {
    if (order_id) {
      this.ordersService
        .deleteOrder(order_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido removido com sucesso!',
                life: 2500,
              });

              this.getAPIOrdersDatas();
            }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
