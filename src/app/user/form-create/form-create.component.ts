import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';


import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Employe } from '../../model/employe';
import { EmployeeService } from '../../services/employee.service';

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
    MatIcon,
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private employeesService = inject(EmployeeService);

  empleados: Employe[] = [];

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USER' },
  ];

  userForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      empleadoId: [null, [Validators.required]],
      estado: [1, [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.empleados = data;
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formValue = this.userForm.value;

    const user = {
      email: formValue.email,
      password: formValue.password,
      empleadoId: formValue.empleadoId,
      estado: formValue.estado,
      roles: [formValue.roles],
    };

    this.userService.createUser(user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario ha sido registrado exitosamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.dialogRef.close(response);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message ||
            error.message ||
            'Ocurrió un error al registrar el usuario.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}