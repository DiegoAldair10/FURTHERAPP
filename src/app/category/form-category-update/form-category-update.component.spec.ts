import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoryUpdateComponent } from './form-category-update.component';

describe('FormCategoryUpdateComponent', () => {
  let component: FormCategoryUpdateComponent;
  let fixture: ComponentFixture<FormCategoryUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoryUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
