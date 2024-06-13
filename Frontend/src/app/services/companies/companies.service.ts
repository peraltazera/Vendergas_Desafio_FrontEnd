import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CreateCompanyRequest } from 'src/app/models/interfaces/companies/request/CreateCompanyRequest';
import { CreateCompanyResponse } from 'src/app/models/interfaces/companies/response/CreateCompanyResponse';
import { DeleteCompanyResponse } from 'src/app/models/interfaces/companies/response/DeleteCompanyResponse';
import { GetAllCompanyResponse } from 'src/app/models/interfaces/companies/response/GetAllCompanyResponse';
import { environment } from 'src/environments/environment';
import { EditCompanyRequest } from 'src/app/models/interfaces/companies/request/EditCompanyRequest';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private ID_USER = this.cookie.get('USER_ID');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllCompanies(): Observable<Array<GetAllCompanyResponse>> {
    return this.http.get<Array<GetAllCompanyResponse>>(
      `${this.API_URL}/empresas/usuario/${this.ID_USER}`,
      this.httpOptions
    );
  }

  deleteCompany(Company_id: string): Observable<DeleteCompanyResponse> {
    return this.http.delete<DeleteCompanyResponse>(
      `${this.API_URL}/empresas/${Company_id}`,
      this.httpOptions
    );
  }

  createCompany(
    requestDatas: CreateCompanyRequest
  ): Observable<CreateCompanyResponse> {
    return this.http.post<CreateCompanyResponse>(
      `${this.API_URL}/empresas`,
      requestDatas,
      this.httpOptions
    );
  }

  editCompany(requestDatas: EditCompanyRequest, Company_id: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/empresas/${Company_id}`,
      requestDatas,
      this.httpOptions
    );
  }
}
