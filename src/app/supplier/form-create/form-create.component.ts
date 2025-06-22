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
import { SupplierService } from '../../services/supplier.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent {
  private fb = inject(FormBuilder);
  private suppliersService = inject(SupplierService);

  supplierForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.supplierForm = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplier = {
        ...this.supplierForm.value,
      };

      this.suppliersService.createSuppliers(supplier).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor creado',
            text: 'El proveedor ha sido registrado exitosamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el proveedor.';
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
