import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDetailsComponent } from './perfil-details.component';

describe('PerfilDetailsComponent', () => {
  let component: PerfilDetailsComponent;
  let fixture: ComponentFixture<PerfilDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
