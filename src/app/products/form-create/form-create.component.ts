import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductService);

  productsForm: FormGroup;

  categorias = [
    { id: 1, nombre: 'Celulares' },
    { id: 2, nombre: 'Computadoras' },
    { id: 3, nombre: 'Placas' },
    { id: 4, nombre: 'CPU' },
    { id: 5, nombre: 'Monitores' },
  ];

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.productsForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required]],
      categoria: ['', Validators.required],
      stock: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productsForm.valid) {
      const customer = {
        ...this.productsForm.value,
      };

      this.productsService.createProducts(customer).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Producto creado',
            text: 'El Producto ha sido registrado exitosamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el producto.';
          if (error.status === 400 && error.error?.message) {
            errorMessage = error.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
