import { map } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClientEvent } from 'src/app/models/enums/clients/ClientEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllClientResponse } from 'src/app/models/interfaces/clients/response/GetAllClientResponse';
import { DeleteClientAction } from 'src/app/models/interfaces/clients/event/DeleteClientAction';
import { GetCompaniesResponse } from 'src/app/models/interfaces/companies/response/GetCompaniesResponse';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: []
})
export class ClientsTableComponent {
  @Input() clients: Array<GetAllClientResponse> = [];
  @Input() companies: Array<GetCompaniesResponse> = [];
  @Output() clientEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteClientAction>();

  public clientSelected!: GetAllClientResponse;
  public addClientEvent = ClientEvent.ADD_CLIENT_EVENT;
  public editClientEvent = ClientEvent.EDIT_CLIENT_EVENT;

  handleClientEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const clientEventData = id && id !== '' ? { action, id } : { action };
      this.clientEvent.emit(clientEventData);
    }
  }

  handleDeleteClient(client_id: string, clientName: string): void {
    if (client_id !== '' && clientName !== '') {
      this.deleteClientEvent.emit({
        client_id,
        clientName,
      });
    }
  }
}
