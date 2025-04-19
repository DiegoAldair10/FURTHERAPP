import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Employe } from '../model/employe';
import { EmployeeService } from '../services/employee.service';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-employee',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'email',
    'telefono',
    'cargo',
    'actions',
  ];

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEmploye();
  }

  dataSource: Employe[] = [];
  @ViewChild(MatTable) table!: MatTable<Employe>;

  getEmploye(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // ← Añade esto
        this.dataSource = data;
      },
      (error) => console.error('Error al obtener empleados:', error)
    );
  }

  deleteEmployees(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    Swal.fire({
      title: '¿Eliminar empleado?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployees(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El empleado ha sido eliminado.',
            'success'
          ).then(() => {
            this.dataSource = this.dataSource.filter(
              (employee) => employee.empleadoId !== id
            );
            this.table.renderRows();
          });
        });
      }
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(FormCreateComponent, {
      width: '600px',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((employee: Employe) => {
      if (employee) {
        this.dataSource = [...this.dataSource, employee];
      }
    });
  }

  openEditDialog(employee: Employe, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { employee },
    });

    dialogRef.afterClosed().subscribe((employee: Employe) => {
      if (employee) {
        const index = this.dataSource.findIndex(
          (e) => e.empleadoId === employee.empleadoId
        );
        if (index !== -1) {
          this.dataSource[index] = employee;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
