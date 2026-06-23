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
import { EmployeeService } from '../../services/employee.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    MatIcon
],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);

  cargos = [
    { id: 1, nombre: 'ADMINISTRADOR' },
    { id: 2, nombre: 'P-VENDEDOR' },
  ];

  employeeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.employeeForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      cargo: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const customer = {
        ...this.employeeForm.value,
      };

      this.employeeService.createEmployees(customer).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Empleado creado',
            text: 'El Empleado ha sido registrado exitosamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el empleado.';
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
