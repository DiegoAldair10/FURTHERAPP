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
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../model/supplier';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css',
})
export class FormUpdateComponent implements OnInit {
  supplirsForm!: FormGroup;
  isUpdating = false; // Para evitar múltiples envíos

  constructor(
    private fb: FormBuilder,
    private suppliersService: SupplierService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: Supplier }
  ) {}

  ngOnInit(): void {
    this.supplirsForm = this.fb.group({
      nombre: [this.data.supplier.nombre, Validators.required],
      contacto: [this.data.supplier.contacto, Validators.required],
      email: [
        this.data.supplier.email,
        [Validators.required, Validators.email],
      ],
      telefono: [
        this.data.supplier.telefono,
        [Validators.required, Validators.pattern(/^\d{9}$/)],
      ],
      direccion: [this.data.supplier.direccion, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.supplirsForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedSupplier: Supplier = {
        ...this.data.supplier,
        ...this.supplirsForm.value,
      };

      this.suppliersService
        .updateSuppliers(this.data.supplier.proveedorId, updatedSupplier)
        .subscribe({
          next: () => {
            Swal.fire(
              'Se actualizo proveedor',
              'Proveedor actualizado correctamente',
              'success'
            );
            this.dialogRef.close(updatedSupplier);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
            this.isUpdating = false;
          },
        });
    }
  }
  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}
