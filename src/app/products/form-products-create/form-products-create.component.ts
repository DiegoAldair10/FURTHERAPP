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
import { CategoryService } from '../../services/category.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-form-products-create',
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
    MatIcon
],
  templateUrl: './form-products-create.component.html',
  styleUrl: './form-products-create.component.css',
})
export class FormProductsCreateComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductService);
  private categorysService = inject(CategoryService);

  productsForm: FormGroup;

  Categorys: any[] = [];

  constructor(public dialogRef: MatDialogRef<FormProductsCreateComponent>) {
    this.productsForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio_venta: ['', [Validators.required]],
      costo_promedio: ['', [Validators.required]],
      categoriaId: ['', Validators.required],
      stock: ['', Validators.required],
      estado: ['Y', Validators.required],
    });

    this.loadCategorys();
  }

  // Método para cargar categorías
  loadCategorys(): void {
    this.categorysService.getCategories().subscribe({
      next: (data) => {
        this.Categorys = data;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      },
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
