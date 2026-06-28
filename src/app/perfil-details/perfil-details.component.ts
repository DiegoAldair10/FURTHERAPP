import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Perfil } from '../model/perfil';
import { PerfilService } from '../services/perfil.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-perfil-details',
  imports: [

    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './perfil-details.component.html',
  styleUrl: './perfil-details.component.css'
})
export class PerfilDetailsComponent  implements OnInit {
  perfil?: Perfil;

  perfilForm!: FormGroup;
  passwordForm!: FormGroup;

  isLoading = false;
  isSaving = false;
  isChangingPassword = false;

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getPerfil();
  }

  initForms(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
    });
  }

  getPerfil(): void {
    this.isLoading = true;

    this.perfilService.getPerfil().subscribe({
      next: (data) => {
        this.perfil = data;

        this.perfilForm.patchValue({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          telefono: data.telefono || '',
        });

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;

        Swal.fire(
          'Error',
          'No se pudo cargar la información del perfil',
          'error',
        );
      },
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid || this.isSaving) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.perfilService.updatePerfil(this.perfilForm.value).subscribe({
      next: (data) => {
        this.perfil = data;
        this.isSaving = false;

        Swal.fire(
          'Perfil actualizado',
          'Tus datos fueron actualizados correctamente',
          'success',
        );
      },
      error: (error) => {
        this.isSaving = false;

        Swal.fire(
          'Error',
          error.error?.message || 'No se pudo actualizar el perfil',
          'error',
        );
      },
    });
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid || this.isChangingPassword) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const data = this.passwordForm.value;

    if (data.nuevaPassword !== data.confirmarPassword) {
      Swal.fire(
        'Error',
        'Las contraseñas no coinciden',
        'error',
      );
      return;
    }

    this.isChangingPassword = true;

    this.perfilService.cambiarPassword(data).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();

        Swal.fire(
          'Contraseña actualizada',
          'Tu contraseña fue cambiada correctamente',
          'success',
        );
      },
      error: (error) => {
        this.isChangingPassword = false;

        Swal.fire(
          'Error',
          error.error?.message || 'No se pudo cambiar la contraseña',
          'error',
        );
      },
    });
  }

  get iniciales(): string {
    const nombre = this.perfil?.nombre || '';
    const apellido = this.perfil?.apellido || '';

    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U';
  }

  get estadoTexto(): string {
    return this.perfil?.estado === 1 ? 'Activo' : 'Inactivo';
  }
}
