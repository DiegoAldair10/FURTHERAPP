import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductsCreateComponent } from './form-products-create.component';

describe('FormProductsCreateComponent', () => {
  let component: FormProductsCreateComponent;
  let fixture: ComponentFixture<FormProductsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProductsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProductsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
