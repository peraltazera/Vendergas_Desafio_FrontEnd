import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';

@Injectable({
  providedIn: 'root',
})
export class CompaniesDataTransferService {
  public companiesDataEmitter$ =
    new BehaviorSubject<Array<GetAllCompanyResponse> | null>(null);
  public companiesDatas: Array<GetAllCompanyResponse> = [];

  setCompaniesDatas(companies: Array<GetAllCompanyResponse>): void {
    if (companies) {
      this.companiesDataEmitter$.next(companies);
      this.getCompaniesDatas();
    }
  }

  getCompaniesDatas() {
    this.companiesDataEmitter$
      .pipe(
        take(1)
        //map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.companiesDatas = response;
          }
        },
      });
      console.log(this.companiesDatas)
    return this.companiesDatas;
  }
}
