import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { SalesPayments } from '../model/salesPayments';
import { SalesPaymentsService } from '../services/sales-payments.service';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-sales-payments',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './sales-payments.component.html',
  styleUrl: './sales-payments.component.css',
})
export class SalesPaymentsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'venta',
    'metodoPago',
    'estado',
    'monto',
    'fecha_Pago',
    'detalles',
    'actions',
  ];

  constructor(
    private salesPaymentsService: SalesPaymentsService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getSalesPayments();
  }

  dataSource: SalesPayments[] = [];
  @ViewChild(MatTable) table!: MatTable<SalesPayments>;

  getSalesPayments(): void {
    this.salesPaymentsService.getSalesPayments().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      },
    );
  }

  deleteSales(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    Swal.fire({
      title: '¿Anular pago?',
      text: 'El pago quedará marcado como ANULADO',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.salesPaymentsService.deleteSalesPayment(id).subscribe({
          next: () => {
            Swal.fire(
              'Pago Anulado',
              'El pago fue anulado correctamente',
              'success',
            );

            // RECARGAR DATOS
            this.getSalesPayments();
          },

          error: (error) => {
            let mensaje = 'No se pudo anular el pago';

            if (error.error?.message) {
              mensaje = error.error.message;
            }

            Swal.fire('Error', mensaje, 'error');
          },
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormCreateComponent, {
      width: '700px', // ancho fijo pero responsive
      maxWidth: '90vw', // limite responsive
      maxHeight: '90vh', // límite de altura de la pantalla
      panelClass: 'custom-dialog', // para aplicar estilos CSS específicos
    });

    dialogRef.afterClosed().subscribe((salesPayment: SalesPayments) => {
      if (salesPayment) {
        this.getSalesPayments();
      }
    });
  }

  openEditDialog(salesPayment: SalesPayments, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { salesPayment },
    });
    dialogRef.afterClosed().subscribe((salesPayment: SalesPayments) => {
      if (salesPayment) {
        this.getSalesPayments();
      }
    });
  }
}
