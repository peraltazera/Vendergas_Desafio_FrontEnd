import { TestBed } from '@angular/core/testing';

import { OrdersProductsDataTransferService } from './order_products-data-transfer.service';

describe('ProductsDataTransferService', () => {
  let service: OrdersProductsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersProductsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
