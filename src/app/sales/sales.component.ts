import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Sales } from '../model/sales';
import { SalesService } from '../services/sales.service';
import Swal from 'sweetalert2';
import { FormUpdateComponent } from './form-update/form-update.component';
import { FormCreateComponent } from './form-create/form-create.component';

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'cliente',
    'empleado',
    'fechaVenta',
    'totalVenta',
    'detalles',
    'actions',
  ];

  constructor(
    private salesServices: SalesService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSales();
  }

  dataSource: Sales[] = [];
  @ViewChild(MatTable) table!: MatTable<Sales>;

  getSales(): void {
    this.salesServices.getSales().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      }
    );
  }
  deleteSales(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    Swal.fire({
      title: '¿Eliminar venta?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesServices.deleteSales(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La venta ha sido eliminada.', 'success');
            this.dataSource = this.dataSource.filter((s) => s.ventaId !== id);
            this.table.renderRows();
          },
          error: (err) => {
            console.error('Error al eliminar venta:', err);
            Swal.fire(
              'Error',
              err.message || 'No se pudo eliminar la venta.',
              'error'
            );
          },
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

    dialogRef.afterClosed().subscribe((sales: Sales) => {
      if (sales) {
        this.dataSource = [...this.dataSource, sales];
      }
    });
  }

  openEditDialog(sale: Sales, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { sale },
    });

    dialogRef.afterClosed().subscribe((sale: Sales) => {
      if (sale) {
        const index = this.dataSource.findIndex(
          (e) => e.ventaId === sale.ventaId
        );
        if (index !== -1) {
          this.dataSource[index] = sale;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
