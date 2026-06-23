import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Form,
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
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { MatIcon } from "@angular/material/icon";

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
    MatIcon
],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);

  paymentForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.paymentForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }
  

    onSubmit(): void {
      if (this.paymentForm.valid) {
        const customer = {
          ...this.paymentForm.value,

        };

        this.paymentService.createPayments(customer).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Metodo de pago creado',
              text: 'El Metodo de pago ha sido registrado exitosamente.',
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
