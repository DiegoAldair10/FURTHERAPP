import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SalesService } from '../../services/sales.service';
import { CustomerService } from '../../services/customer.service';
import { EmployeeService } from '../../services/employee.service';
import { ProductService } from '../../services/product.service';

import { Product } from '../../model/product';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-create',
  standalone: true,
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
    MatIconModule,
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SalesService);
  private clienteService = inject(CustomerService);
  private empleadoService = inject(EmployeeService);
  private productoService = inject(ProductService);

  customers: any[] = [];
  employees: any[] = [];
  products: Product[] = [];
  salesForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.salesForm = this.fb.group({
      cliente: [null, Validators.required],
      empleado: [null, Validators.required],
      detalles: this.fb.array([]),
      totalVenta: [{ value: 0, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.agregarDetalle();
  }

  get detalles(): FormArray {
    return this.salesForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [
        { value: 0, disabled: false },
        [Validators.required, Validators.min(0)],
      ],
    });

    // Cuando cambia el producto, autocompletar precio
    detalleGroup.get('producto')?.valueChanges.subscribe((producto) => {
      const p = producto as unknown as Product;
      if (p && p.precio != null) {
        detalleGroup.get('precioUnitario')?.setValue(p.precio);
      } else {
        detalleGroup.get('precioUnitario')?.setValue(0);
      }
      this.calcularTotal();
    });

    // Recalcular total al cambiar cantidad o precio
    detalleGroup
      .get('cantidad')
      ?.valueChanges.subscribe(() => this.calcularTotal());
    detalleGroup
      .get('precioUnitario')
      ?.valueChanges.subscribe(() => this.calcularTotal());

    this.detalles.push(detalleGroup);
  }

  eliminarUltimoDetalle(): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(this.detalles.length - 1);
      this.calcularTotal();
    }
  }

  cargarDatos(): void {
    this.clienteService
      .getCustomers()
      .subscribe((data) => (this.customers = data));
    this.empleadoService
      .getEmployees()
      .subscribe((data) => (this.employees = data));
    this.productoService
      .getProducts()
      .subscribe((data) => (this.products = data));
  }

  calcularTotal(): void {
    const detalles = this.salesForm.getRawValue().detalles;
    const total = detalles.reduce(
      (acc: number, d: any) => acc + d.cantidad * d.precioUnitario,
      0
    );
    this.salesForm.get('totalVenta')?.setValue(total);
  }

  onSubmit(): void {
    if (this.salesForm.valid) {
      this.calcularTotal();

      const formValue = this.salesForm.getRawValue();
      const total = this.salesForm.get('totalVenta')?.value;

      const sale = {
        ventaId: undefined as any,
        fechaVenta: new Date().toISOString(),
        totalVenta: total,
        cliente: { clienteId: formValue.cliente.clienteId },
        empleado: { empleadoId: formValue.empleado.empleadoId },
        detalles: formValue.detalles.map((d: any) => ({
          producto: { productoId: d.producto.productoId },
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })),
      };

      this.saleService.createSales(sale).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Venta creada',
            text: 'La venta ha sido registrada exitosamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.dialogRef.close(response);
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar la venta.',
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
