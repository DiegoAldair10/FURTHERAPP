import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer';
import { FormUpdateComponent } from './form-update/form-update.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormCustomerComponent } from './form-customer/form-customer.component';

@Component({
  selector: 'app-customer',

  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'email',
    'telefono',
    'direccion',
    'ciudad',
    'pais',
    'fechaRegistro',
    'actions',
  ];
  dataSource: Customer[] = [];

  @ViewChild(MatTable) table!: MatTable<Customer>;

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit() {
    this.getCustomer();
  }

  getCustomer(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // ← Añade esto
        this.dataSource = data;
      },
      (error) => console.error('Error al obtener clientes:', error)
    );
  }

  deleteCustomer(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomers(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El cliente ha sido eliminado.',
            'success'
          ).then(() => {
            // Actualizar la tabla o recargar los datos
            this.dataSource = this.dataSource.filter(
              (customer) => customer.clienteId !== id
            );
            this.table.renderRows();
          });
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormCustomerComponent, {
      width: '600px',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((customer: Customer) => {
      if (customer) {
        this.dataSource = [...this.dataSource, customer];
      }
    });
  }

  openEditDialog(customer: Customer, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado
  
    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { customer },
    });
  
    dialogRef.afterClosed().subscribe((customer: Customer) => {
      if (customer) {
        const index = this.dataSource.findIndex(
          (c) => c.clienteId === customer.clienteId
        );
        if (index !== -1) {
          this.dataSource[index] = customer;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
  
}
