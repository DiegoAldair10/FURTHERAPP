import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USER' },
  ];

  userForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      estado: [1, [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
  if (this.userForm.valid) {

    const formValue = this.userForm.value;

    const user = {
      email: formValue.email,
      password: formValue.password,
      estado: formValue.estado,
      roles: [formValue.roles]
    };

    console.log('Usuario enviado:', user);

    this.userService.createUser(user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El Usuario ha sido registrado exitosamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.dialogRef.close(response);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al registrar el usuario.',
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
