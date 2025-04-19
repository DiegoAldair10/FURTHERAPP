import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Customer } from '../../model/customer';
import { EmployeeService } from '../../services/employee.service';
import { Employe } from '../../model/employe';
import Swal from 'sweetalert2';

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
  styleUrl: './form-update.component.css'
})
export class FormUpdateComponent implements OnInit {
  employeeForm!: FormGroup;
  isUpdating = false; // Para evitar múltiples envíos

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employe }
  ) {}
  

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      nombre: [this.data.employee.nombre, Validators.required],
      apellido: [this.data.employee.apellido, Validators.required],
      email: [this.data.employee.email,[Validators.required, Validators.email],],
      telefono: [ this.data.employee.telefono, [Validators.required, Validators.pattern(/^\d{9}$/)],],
      cargo: [this.data.employee.cargo, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const updatedEmployees: Employe = {
        ...this.data.employee,
        ...this.employeeForm.value,
      };

      this.employeeService
        .updateEmployees(this.data.employee.empleadoId, updatedEmployees)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Empleado actualizado correctamente', 'success');
            this.dialogRef.close(updatedEmployees); // ← devolvemos cliente actualizado
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
            this.isUpdating = false;
          },
        });
    }
  }
  closeDialogUpdate(): void {
    this.dialogRef.close();
  }

}
