import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../../services/user.service';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { Usuario } from '../../model/usuario';
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
    MatIcon,
  ],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css',
})
export class FormUpdateComponent implements OnInit {
  userForm!: FormGroup;
  isUpdating = false;

  empleados: any[] = [];

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USER' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeesService: EmployeeService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Usuario },
  ) {}

  ngOnInit(): void {
    this.getEmployees();

    this.userForm = this.fb.group({
      email: [this.data.user.email, [Validators.required, Validators.email]],

      password: [this.data.user.password, Validators.required],

      empleadoId: [
        this.data.user.empleadoId ||
          this.data.user.empleado?.empleadoId ||
          null,
        Validators.required,
      ],

      estado: [this.data.user.estado, Validators.required],

      roles: [this.data.user.roles?.[0]?.nombre || '', Validators.required],
    });
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
    if (this.userForm.invalid || this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    const formValue = this.userForm.value;

    const updatedUser: any = {
      email: formValue.email,
      estado: formValue.estado,
      empleadoId: formValue.empleadoId,
      roles: [formValue.roles],
    };

    if (formValue.password && formValue.password.trim() !== '') {
      updatedUser.password = formValue.password;
    }

    this.userService
      .updateUser(this.data.user.usuariosId, updatedUser)
      .subscribe({
        next: (response) => {
          Swal.fire(
            'Usuario actualizado',
            'Usuario actualizado correctamente',
            'success',
          ).then(() => {
            this.dialogRef.close(response);
          });
        },

        error: (error) => {
          Swal.fire(
            'Error',
            error.error?.message ||
              error.message ||
              'No se pudo actualizar el usuario',
            'error',
          );

          this.isUpdating = false;
        },
      });
  }

  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}
