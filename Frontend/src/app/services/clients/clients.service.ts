import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CreateClientRequest } from 'src/app/models/interfaces/clients/request/CreateClientRequest';
import { CreateClientResponse } from 'src/app/models/interfaces/clients/response/CreateClientResponse';
import { DeleteClientResponse } from 'src/app/models/interfaces/clients/response/DeleteClientResponse';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import { environment } from 'src/environments/environment';
import { EditClientRequest } from 'src/app/models/interfaces/clients/request/EditClientRequest';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllClients(): Observable<Array<GetAllClientResponse>> {
    return this.http
      .get<Array<GetAllClientResponse>>(
        `${this.API_URL}/clientes`,
        this.httpOptions
      );
  }

  deleteClient(client_id: string): Observable<DeleteClientResponse> {
    return this.http.delete<DeleteClientResponse>(
      `${this.API_URL}/clientes/${client_id}`,
      this.httpOptions
    );
  }

  createClient(
    requestDatas: CreateClientRequest
  ): Observable<CreateClientResponse> {
    return this.http.post<CreateClientResponse>(
      `${this.API_URL}/clientes`,
      requestDatas,
      this.httpOptions
    );
  }

  editClient(requestDatas: EditClientRequest, client_id: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/clientes/${client_id}`,
      requestDatas,
      this.httpOptions
    );
  }
}
