import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersProductsTableComponent } from './orders-products-table.component';

describe('OrdersProductsTableComponent', () => {
  let component: OrdersProductsTableComponent;
  let fixture: ComponentFixture<OrdersProductsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersProductsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersProductsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
