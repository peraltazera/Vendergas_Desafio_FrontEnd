import { TestBed } from '@angular/core/testing';

import { ClientsDataTransferService } from './clients-data-transfer.service';

describe('ProductsDataTransferService', () => {
  let service: ClientsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
