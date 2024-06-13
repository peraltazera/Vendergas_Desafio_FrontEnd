import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyEvent } from 'src/app/models/enums/companies/CompanyEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { DeleteCompanyAction } from 'src/app/models/interfaces/companies/event/DeleteCompanyAction';

@Component({
  selector: 'app-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: []
})
export class CompanyTableComponent {
  @Input() companies: Array<GetAllCompanyResponse> = [];
  @Output() companyEvent = new EventEmitter<EventAction>();
  @Output() deleteCompanyEvent = new EventEmitter<DeleteCompanyAction>();

  public companySelected!: GetAllCompanyResponse;
  public addCompanyEvent = CompanyEvent.ADD_COMPANY_EVENT;
  public editCompanyEvent = CompanyEvent.EDIT_COMPANY_EVENT;

  handleCompanyEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const companyEventData = id && id !== '' ? { action, id } : { action };
      this.companyEvent.emit(companyEventData);
    }
  }

  handleDeleteCompany(company_id: string, companyName: string): void {
    if (company_id !== '' && companyName !== '') {
      this.deleteCompanyEvent.emit({
        company_id,
        companyName,
      });
    }
  }
}
