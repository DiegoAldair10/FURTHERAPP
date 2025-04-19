import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-update',
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
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css'
})
export class FormUpdateComponent  implements OnInit{

  productsForm!: FormGroup;
  isUpdating = false; // Para evitar múltiples envíos
  categorias = [
    { id: 1, nombre: 'Celulares' },
    { id: 2, nombre: 'Computadoras' },
    { id: 3, nombre: 'Placas' },
    { id: 4, nombre: 'CPU' },
    { id: 5, nombre: 'Monitores' },
  ];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {}

  ngOnInit(): void {
    this.productsForm = this.fb.group({
      nombre: [this.data.product.nombre, Validators.required],
      descripcion: [this.data.product.descripcion, Validators.required],
      precio: [ this.data.product.precio, Validators.required],
      categoria: [this.data.product.categoria, Validators.required],
      stock: [this.data.product.stock, Validators.required],
    });
  }

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
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
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
