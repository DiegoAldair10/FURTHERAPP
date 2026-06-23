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
import { Payment } from '../../model/payment';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { MatIcon } from "@angular/material/icon";

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
    MatIcon
],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css',
})
export class FormUpdateComponent implements OnInit {
  paymentForm!: FormGroup;
  isUpdating = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payment: Payment }
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      nombre: [this.data.payment.nombre, Validators.required],
      descripcion: [this.data.payment.descripcion, Validators.required],
    });
  }
  onSubmit(): void {
    if (this.paymentForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedPayments: Payment = {
        ...this.data.payment,
        ...this.paymentForm.value,
      };

      this.paymentService
        .updatePayments(this.data.payment.metodoPagoId, updatedPayments)
        .subscribe({
          next: () => {
            Swal.fire(
              'Se actualizo el metodo de pago',
              'Pago actualizado correctamente',
              'success'
            );
            this.dialogRef.close(updatedPayments); // ← devolvemos cliente actualizado
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar el metodo de pago',
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
