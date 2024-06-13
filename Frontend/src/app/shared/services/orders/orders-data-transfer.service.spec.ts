import { TestBed } from '@angular/core/testing';

import { OrdersDataTransferService } from './orders-data-transfer.service';

describe('ProductsDataTransferService', () => {
  let service: OrdersDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
