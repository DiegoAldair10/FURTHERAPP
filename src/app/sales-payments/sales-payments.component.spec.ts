import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPaymentsComponent } from './sales-payments.component';

describe('SalesPaymentsComponent', () => {
  let component: SalesPaymentsComponent;
  let fixture: ComponentFixture<SalesPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
