import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';

@Injectable({
  providedIn: 'root',
})
export class ClientsDataTransferService {
  public clientsDataEmitter$ =
    new BehaviorSubject<Array<GetAllClientResponse> | null>(null);
  public clientsDatas: Array<GetAllClientResponse> = [];

  setClientsDatas(clients: Array<GetAllClientResponse>): void {
    if (clients) {
      this.clientsDataEmitter$.next(clients);
      this.getClientsDatas();
    }
  }

  getClientsDatas() {
    this.clientsDataEmitter$
      .pipe(
        take(1)
        //map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.clientsDatas = response;
          }
        },
      });
      console.log(this.clientsDatas)
    return this.clientsDatas;
  }
}
