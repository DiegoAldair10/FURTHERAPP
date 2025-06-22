import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Supplier } from '../model/supplier';
import { SupplierService } from '../services/supplier.service';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-supplier',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'contacto',
    'email',
    'telefono',
    'direccion',
    'actions',
  ];

  dataSource: Supplier[] = [];

  @ViewChild(MatTable) table!: MatTable<Supplier>;

  constructor(
    private supplierService: SupplierService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.supplierService.getSupplier().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // ← Añade esto
        this.dataSource = data;
      },
      (error) => console.error('Error al obtener clientes:', error)
    );
  }

  deleteSuppliers(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.supplierService.deleteSuppliers(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El proveedor ha sido eliminado.',
            'success'
          ).then(() => {
            // Actualizar la tabla o recargar los datos
            this.dataSource = this.dataSource.filter(
              (supplier) => supplier.proveedorId !== id
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

    dialogRef.afterClosed().subscribe((supplier: Supplier) => {
      if (supplier) {
        this.dataSource = [...this.dataSource, supplier];
      }
    });
  }

  openEditDialog(supplier: Supplier, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { supplier },
    });

    dialogRef.afterClosed().subscribe((supplier: Supplier) => {
      if (supplier) {
        const index = this.dataSource.findIndex(
          (s) => s.proveedorId === supplier.proveedorId
        );
        if (index !== -1) {
          this.dataSource[index] = supplier;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
