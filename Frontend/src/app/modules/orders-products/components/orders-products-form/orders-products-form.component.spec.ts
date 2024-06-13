import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersProductsFormComponent } from './orders-products-form.component';

describe('OrdersProductsFormComponent', () => {
  let component: OrdersProductsFormComponent;
  let fixture: ComponentFixture<OrdersProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersProductsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
