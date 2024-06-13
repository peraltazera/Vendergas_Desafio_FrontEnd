import { TestBed } from '@angular/core/testing';

import { OrdersProductsService } from './orders-products.service';

describe('OrdersProductsService', () => {
  let service: OrdersProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
