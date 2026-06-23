import { Component, Inject } from '@angular/core';
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
    MatSelectModule,
    MatIcon
],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css',
})
export class FormUpdateComponent {
  userForm!: FormGroup;
  isUpdating = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Usuario },
  ) {}

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'USER' },
  ];

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [this.data.user.email, [Validators.required, Validators.email]],
      estado: [this.data.user.estado, Validators.required],
      password: [this.data.user.password, Validators.required],
      roles: [this.data.user.roles?.[0]?.nombre || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const formValue = this.userForm.value;

      const updatedUser = {
        email: formValue.email,
        password: formValue.password,
        estado: formValue.estado,
        roles: [formValue.roles],
      };

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
              error.message || 'No se pudo actualizar el usuario',
              'error',
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
