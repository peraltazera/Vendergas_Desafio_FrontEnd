import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import {ClientsService } from '../../../../services/clients/clients.service';
import { ClientsDataTransferService } from 'src/app/shared/services/clients/clients-data-transfer.service';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientsFormComponent } from '../../components/clients-form/clients-form.component';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';

@Component({
  selector: 'app-clients-home',
  templateUrl: './clients-home.component.html',
  styleUrls: []
})
export class ClientsHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public clientsDatas: Array<GetAllClientResponse> = [];
  public companiesDatas: Array<GetCompaniesResponse> = [];

  constructor(
    private companiesService: CompaniesService,
    private clientsService: ClientsService,
    private clientsDtService: ClientsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllCompanies();
    this.getServiceClientsDatas();
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

  getServiceClientsDatas() {
    const clisntsLoaded = this.clientsDtService.getClientsDatas();

    if (clisntsLoaded.length > 0) {
      this.clientsDatas = clisntsLoaded;
      console.log(this.clientsDatas)
    } else this.getAPIClientsDatas();

  }

  getAPIClientsDatas() {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            const idCompanies = new Set(this.companiesDatas.map(e => e._id));
            this.clientsDatas = response.filter(obj => idCompanies.has(obj.empresa));
            console.log(this.clientsDatas)
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar clients',
            life: 2500,
          });
          this.router.navigate(['/clients']);
        },
      });
  }

  handleClientAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ClientsFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          clientDatas: this.clientsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIClientsDatas(),
      });
    }
  }

  handleDeleteClientAction(event: {
    client_id: string;
    clientName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do cliente: ${event?.clientName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteClient(event?.client_id),
      });
    }
  }

  deleteClient(client_id: string) {
    if (client_id) {
      this.clientsService
        .deleteClient(client_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente removido com sucesso!',
                life: 2500,
              });

              this.getAPIClientsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover cliente!',
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
