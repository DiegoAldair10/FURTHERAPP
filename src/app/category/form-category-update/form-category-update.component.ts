import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-form-category-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon
],
  templateUrl: './form-category-update.component.html',
  styleUrl: './form-category-update.component.css',
})
export class FormCategoryUpdateComponent  implements OnInit {

categoryForm!: FormGroup;
  isUpdating = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<FormCategoryUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: Category }
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      nombre: [this.data.category.nombre, Validators.required],
      descripcion: [this.data.category.descripcion, Validators.required],
    });
  }
  onSubmit(): void {
    if (this.categoryForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedCategory: Category = {
        ...this.data.category,
        ...this.categoryForm.value,
      };

      this.categoryService
        .updateCategory(this.data.category.categoriaId, updatedCategory)
        .subscribe({
          next: () => {
            Swal.fire(
              'Se actualizo la categoria',
              'Categoria actualizada correctamente',
              'success'
            );
            this.dialogRef.close(updatedCategory); // ← devolvemos cliente actualizado
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar la categoria',
              'error'
            );
            this.isUpdating = false;
          },
        });
    }
  }
  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}
