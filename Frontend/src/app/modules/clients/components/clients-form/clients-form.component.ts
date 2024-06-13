import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { CreateClientRequest } from 'src/app/models/interfaces/clients/request/CreateClientRequest';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import { ClientsDataTransferService } from 'src/app/shared/services/clients/clients-data-transfer.service';
import { ClientEvent } from 'src/app/models/enums/clients/ClientEvent';
import { EditClientRequest } from 'src/app/models/interfaces/clients/request/EditClientRequest';

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: []
})
export class ClientsFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public companiesDatas: Array<GetAllCompanyResponse> = [];
  public selectedCompany: Array<{ nome: string; code: string }> = [];
  public clientAction!: {
    event: EventAction;
    clientDatas: Array<GetAllClientResponse>;
  };
  public clientSelectedDatas!: GetAllClientResponse;
  public clientsDatas: Array<GetAllClientResponse> = [];
  public addClientForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', Validators.required],
    telefone: ['', Validators.required],
    empresa: ['', Validators.required],
  });
  public editClientForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', Validators.required],
    telefone: ['', Validators.required],
  });
  public addClientAction = ClientEvent.ADD_CLIENT_EVENT;
  public editClientAction = ClientEvent.EDIT_CLIENT_EVENT;

  constructor(
    private companiesService: CompaniesService,
    private clientsService: ClientsService,
    private clientsDtService: ClientsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.clientAction = this.ref.data;

    if (
      this.clientAction?.event?.action === this.editClientAction &&
      this.clientAction?.clientDatas
    ) {
      this.getClientSelectedDatas(this.clientAction?.event?.id as string);
    }

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

  handleSubmitAddClient(): void {
    if (this.addClientForm?.value && this.addClientForm?.valid) {
      const requestCreateClient: CreateClientRequest = {
        nome: this.addClientForm.value.nome as string,
        email: this.addClientForm.value.email as string,
        telefone: this.addClientForm.value.telefone as string,
        empresa: this.addClientForm.value.empresa as string
      };

      this.clientsService
        .createClient(requestCreateClient)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente criado com sucesso!',
                life: 2500,
              });
            }
            this.addClientForm.reset();
            this.ref.closable
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

  handleSubmitEditClient(): void {
    if (
      this.editClientForm.value &&
      this.editClientForm.valid &&
      this.clientAction.event.id
    ) {
      const requestEditClient: EditClientRequest = {
        nome: this.editClientForm.value.nome as string,
        email: this.editClientForm.value.email as string,
        telefone: this.editClientForm.value.telefone as string,
        empresa: this.clientSelectedDatas.empresa as string,
      };

      this.clientsService
        .editClient(requestEditClient, this.clientAction?.event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente editado com sucesso!',
              life: 2500,
            });
            this.editClientForm.reset();
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

  getClientSelectedDatas(clientId: string): void {
    const allClients = this.clientAction?.clientDatas;

    if (allClients.length > 0) {
      const clientFiltered = allClients.filter(
        (element) => element?._id === clientId
      );

      if (clientFiltered) {
        this.clientSelectedDatas = clientFiltered[0];

        this.editClientForm.setValue({
          nome: this.clientSelectedDatas?.nome,
          email: this.clientSelectedDatas?.email,
          telefone: this.clientSelectedDatas?.telefone,
        });
      }
    }
  }

  getClientDatas(): void {
    this.clientsService
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.clientsDatas = response;
            this.clientsDatas &&
              this.clientsDtService.setClientsDatas(this.clientsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
