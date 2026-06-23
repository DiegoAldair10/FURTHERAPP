import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-form-products-update',
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
    MatIcon,
],
  templateUrl: './form-products-update.component.html',
  styleUrl: './form-products-update.component.css',
})
export class FormProductsUpdateComponent implements OnInit {
  productsForm!: FormGroup;
  isUpdating = false; // Para evitar múltiples envíos
  categorias: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<FormProductsUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {}

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      nombre: [this.data.product.nombre, Validators.required],
      descripcion: [this.data.product.descripcion, Validators.required],
      precio_venta: [this.data.product.precio_venta, Validators.required],
      costo_promedio: [this.data.product.costo_promedio, Validators.required],
      estado: [this.data.product.estado, Validators.required],
      categoriaId: [this.data.product.categoriaId, Validators.required],
      stock: [this.data.product.stock, Validators.required],
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
    });
  }

  compareCategorias = (option: Category, value: number) => {
    return option && typeof value === 'number'
      ? option.categoriaId === value
      : false;
  };

  onSubmit(): void {
    if (this.productsForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedProducts: Product = {
        ...this.data.product,
        ...this.productsForm.value,
      };

      this.productsService
        .updateProducts(this.data.product.productoId, updatedProducts)
        .subscribe({
          next: () => {
            Swal.fire(
              'Se actualizo producto',
              'Producto actualizado correctamente',
              'success'
            );
            this.dialogRef.close(updatedProducts); // ← devolvemos cliente actualizado
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
            this.isUpdating = false;
          },
        });
    }
  }
  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}
