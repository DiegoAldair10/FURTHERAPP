import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Payment } from '../model/payment';
import { PaymentService } from '../services/payment.service';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-payment',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];

  dataSource: Payment[] = [];

  @ViewChild(MatTable) table!: MatTable<Payment>;

  constructor(
    private paymentService: PaymentService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit() {
    this.getPayments();
  }

  getPayments(): void {
    this.paymentService.getPayments().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al obtener métodos de pago:', error);
      }
    );
  }

  deleteCustomer(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    Swal.fire({
      title: '¿Eliminar el metodo de pago?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.deletePayments(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El metodo de pago ha sido eliminado.',
            'success'
          ).then(() => {
            // Actualizar la tabla o recargar los datos
            this.dataSource = this.dataSource.filter(
              (payment) => payment.metodoPagoId !== id
            );
            this.table.renderRows();
          });
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

    dialogRef.afterClosed().subscribe((payment: Payment) => {
      if (payment) {
        this.dataSource = [...this.dataSource, payment];
      }
    });
  }

  openEditDialog(payment: Payment, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { payment },
    });

    dialogRef.afterClosed().subscribe((payment: Payment) => {
      if (payment) {
        const index = this.dataSource.findIndex(
          (e) => e.metodoPagoId === payment.metodoPagoId
        );
        if (index !== -1) {
          this.dataSource[index] = payment;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
