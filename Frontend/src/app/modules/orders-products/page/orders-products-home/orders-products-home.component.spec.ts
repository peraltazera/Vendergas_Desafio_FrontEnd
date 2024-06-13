import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersProductsHomeComponent } from './orders-products-home.component';

describe('OrdersProductsHomeComponent', () => {
  let component: OrdersProductsHomeComponent;
  let fixture: ComponentFixture<OrdersProductsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersProductsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersProductsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
