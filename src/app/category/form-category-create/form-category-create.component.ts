import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-category-create',
  imports: [  
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './form-category-create.component.html',
  styleUrl: './form-category-create.component.css'
})
export class FormcategoryCreateComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categoryForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<FormcategoryCreateComponent>) {
    this.categoryForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }
  

    onSubmit(): void {
      if (this.categoryForm.valid) {
        const category = {
          ...this.categoryForm.value,

        };

        this.categoryService.createCategory(category).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Categoria creada',
              text: 'La categoria ha sido registrada exitosamente.',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.dialogRef.close(response); 
            });
          },
          error: (error) => {
            let errorMessage = 'Ocurrió un error al registrar el metodo de pago.';
            if (error.status === 400 && error.error?.message) {
              errorMessage = error.error.message;
            }
  
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    }
  
    closeDialog(): void {
      this.dialogRef.close();
    }


}

