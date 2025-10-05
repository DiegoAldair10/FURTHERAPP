import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcategoryCreateComponent } from './form-category-create.component';

describe('FormcategoryCreateComponent', () => {
  let component: FormcategoryCreateComponent;
  let fixture: ComponentFixture<FormcategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormcategoryCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormcategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
