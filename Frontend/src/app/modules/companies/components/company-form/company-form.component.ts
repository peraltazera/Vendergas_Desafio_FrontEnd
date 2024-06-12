import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { CreateCompanyRequest } from 'src/app/models/interfaces/companies/request/CreateCompanyRequest';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { CompaniesDataTransferService } from 'src/app/shared/services/companies/companies-data-transfer.service';
import { CompanyEvent } from 'src/app/models/enums/companies/CompanyEvent';
import { EditCompanyRequest } from 'src/app/models/interfaces/companies/request/EditCompanyRequest';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: []
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ID_USER = this.cookie.get('USER_ID');
  //public companiesDatas: Array<GetCompaniesResponse> = [];
  //public selectedCompany: Array<{ nome: string; code: string }> = [];
  public CompanyAction!: {
    event: EventAction;
    companyDatas: Array<GetAllCompanyResponse>;
  };
  public companySelectedDatas!: GetAllCompanyResponse;
  public companiesDatas: Array<GetAllCompanyResponse> = [];
  public addCompanyForm = this.formBuilder.group({
    nomeFantasia: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    cnpj: ['', Validators.required],
    usuario: [''],
  });
  public editCompanyForm = this.formBuilder.group({
    nomeFantasia: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    cnpj: ['', Validators.required],
  });
  public addCompanyAction = CompanyEvent.ADD_COMPANY_EVENT;
  public editCompanyAction = CompanyEvent.EDIT_COMPANY_EVENT;
  public saleCompanyAction = CompanyEvent.SALE_COMPANY_EVENT;

  constructor(
    //private companiesService: CompaniesService,
    private companiesService: CompaniesService,
    private companiesDtService: CompaniesDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.CompanyAction = this.ref.data;

    console.log(this.CompanyAction?.event?.action)
    console.log(this.editCompanyAction)
    console.log(this.CompanyAction?.companyDatas)

    if (
      this.CompanyAction?.event?.action === this.editCompanyAction &&
      this.CompanyAction?.companyDatas
    ) {
      this.getCompanySelectedDatas(this.CompanyAction?.event?.id as string);
    }

    this.CompanyAction?.event?.action === this.saleCompanyAction &&
      this.getCompanyDatas();

    //this.getAllCompanies();
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

  handleSubmitAddCompany(): void {
    if (this.addCompanyForm?.value && this.addCompanyForm?.valid) {
      const requestCreateCompany: CreateCompanyRequest = {
        nomeFantasia: this.addCompanyForm.value.nomeFantasia as string,
        razaoSocial: this.addCompanyForm.value.razaoSocial as string,
        cnpj: this.addCompanyForm.value.cnpj as string,
        usuario: this.ID_USER as string
      };

      this.companiesService
        .createCompany(requestCreateCompany)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Empresa criada com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });
    }

    this.addCompanyForm.reset();
  }

  handleSubmitEditCompany(): void {
    if (
      this.editCompanyForm.value &&
      this.editCompanyForm.valid &&
      this.CompanyAction.event.id
    ) {
      const requestEditCompany: EditCompanyRequest = {
        nomeFantasia: this.editCompanyForm.value.nomeFantasia as string,
        razaoSocial: this.editCompanyForm.value.razaoSocial as string,
        cnpj: this.editCompanyForm.value.cnpj as string,
      };

      this.companiesService
        .editCompany(requestEditCompany, this.CompanyAction?.event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editCompanyForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editCompanyForm.reset();
          },
        });
    }
  }

  getCompanySelectedDatas(companyId: string): void {
    const allCompanies = this.CompanyAction?.companyDatas;

    console.log(allCompanies)

    if (allCompanies.length > 0) {
      const companyFiltered = allCompanies.filter(
        (element) => element?._id === companyId
      );

      console.log(companyFiltered)
      console.log(companyId)

      if (companyFiltered) {
        this.companySelectedDatas = companyFiltered[0];

        console.log(this.companySelectedDatas)

        this.editCompanyForm.setValue({
          nomeFantasia: this.companySelectedDatas?.nomeFantasia,
          razaoSocial: this.companySelectedDatas?.razaoSocial,
          cnpj: this.companySelectedDatas?.cnpj,
        });
      }
    }
  }

  getCompanyDatas(): void {
    this.companiesService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.companiesDatas = response;
            this.companiesDatas &&
              this.companiesDtService.setCompaniesDatas(this.companiesDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
