import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer'; // ajusta el path
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
  styleUrls: ['./form-update.component.css'],
})
export class FormUpdateComponent implements OnInit {
  customerForm!: FormGroup;
  isUpdating = false; // Para evitar múltiples envíos

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer }
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      nombre: [this.data.customer.nombre, Validators.required],
      apellido: [this.data.customer.apellido, Validators.required],
      email: [
        this.data.customer.email,
        [Validators.required, Validators.email],
      ],
      telefono: [
        this.data.customer.telefono,
        [Validators.required, Validators.pattern(/^\d{9}$/)],
      ],
      direccion: [this.data.customer.direccion, Validators.required],
      ciudad: [this.data.customer.ciudad, Validators.required],
      pais: [this.data.customer.pais, Validators.required],
    });
  }
  onSubmit(): void {
    if (this.customerForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedCustomer: Customer = {
        ...this.data.customer,
        ...this.customerForm.value,
      };

      this.customerService
        .updateCustomers(this.data.customer.clienteId, updatedCustomer)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Cliente actualizado correctamente', 'success');
            this.dialogRef.close(updatedCustomer); // ← devolvemos cliente actualizado
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
            this.isUpdating = false;
          },
        });
    }
  }
  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}
