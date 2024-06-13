import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompaniesService } from '../../../../services/companies/companies.service';
import { CompaniesDataTransferService } from 'src/app/shared/services/companies/companies-data-transfer.service';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompanyFormComponent } from '../../components/company-form/company-form.component';

@Component({
  selector: 'app-companies-home',
  templateUrl: './companies-home.component.html',
  styleUrls: []
})
export class CompaniesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public companiesDatas: Array<GetAllCompanyResponse> = [];

  constructor(
    private companiesService: CompaniesService,
    private companiesDtService: CompaniesDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceCompaniesDatas();
  }

  getServiceCompaniesDatas() {
    const companiesLoaded = this.companiesDtService.getCompaniesDatas();

    if (companiesLoaded.length > 0) {
      this.companiesDatas = companiesLoaded;
    } else this.getAPICompaniesDatas();

  }

  getAPICompaniesDatas() {
    this.companiesService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.companiesDatas = response;
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
          this.router.navigate(['/companies']);
        },
      });
  }

  handleCompanyAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(CompanyFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          companyDatas: this.companiesDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPICompaniesDatas(),
      });
    }
  }

  handleDeleteCompanyAction(event: {
    company_id: string;
    companyName: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da empresa: ${event?.companyName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCompany(event?.company_id),
      });
    }
  }

  deleteCompany(product_id: string) {
    if (product_id) {
      this.companiesService
        .deleteCompany(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Empresa removida com sucesso!',
                life: 2500,
              });

              this.getAPICompaniesDatas();
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
