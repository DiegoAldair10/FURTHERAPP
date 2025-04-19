import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.css']
})
export class FormCustomerComponent {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  
  customerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormCustomerComponent>) {
    this.customerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      fecha_Registro: [new Date(), Validators.required]
    });
  }

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer = {
        ...this.customerForm.value,
        fecha_Registro: new Date(this.customerForm.value.fecha_Registro).toISOString()
      };

      this.customerService.createCustomers(customer).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente ha sido registrado exitosamente.',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.dialogRef.close(response); 
          });
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el cliente.';
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

  // Método para cerrar el diálogo
  closeDialog(): void {
    this.dialogRef.close();
  }
}