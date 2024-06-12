import { TestBed } from '@angular/core/testing';

import { CompaniesDataTransferService } from './companies-data-transfer.service';

describe('ProductsDataTransferService', () => {
  let service: CompaniesDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
