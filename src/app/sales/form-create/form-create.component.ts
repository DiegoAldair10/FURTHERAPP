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
import { VentaUtilsService } from '../../services/venta-utils.service';
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
  private ventaUtils = inject(VentaUtilsService);

  customers: any[] = [];
  employees: any[] = [];
  products: Product[] = [];
  salesForm: FormGroup;

  comprobantes = [
    { id: 1, nombre: 'FACTURA' },
    { id: 2, nombre: 'BOLETA' },
  ];

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.salesForm = this.fb.group({
      cliente: [null, Validators.required],
      empleado: [null, Validators.required],
      fechaVenta: [new Date().toISOString().substring(0, 10)],
      tipoComprobante: [null, Validators.required],
      numeroComprobante: [''],
      serie: [''], // 👈 agregado
      moneda: ['PEN', Validators.required],
      subTotal: [{ value: 0, disabled: true }],
      igv: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      estado: ['REGISTRADO'], // 👈 valor por defecto
      estadoPago: ['PENDIENTE'], // 👈 valor por defecto
      fecha_Creacion: [new Date().toISOString().substring(0, 10)], // autogenerada
      detalles: this.fb.array([]),
    });
  }

  onTipoComprobanteChange(tipo: string) {
    this.saleService
      .getNextComprobante(tipo)
      .subscribe((comprobante: string) => {
        // comprobante llega como "F001-000002"
        const [serie, numero] = comprobante.split('-');

        this.salesForm.patchValue({
          serie: serie, // se llena F001
          numeroComprobante: numero, // se llena 000002
        });
      });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.agregarDetalle();
    this.salesForm
      .get('tipoComprobante') // 👈 corregido
      ?.valueChanges.subscribe((tipo: string) => {
        if (tipo) {
          this.saleService.getNextComprobante(tipo).subscribe({
            next: (num: string) =>
              this.salesForm.get('numeroComprobante')?.setValue(num),
            error: () =>
              this.salesForm.get('numeroComprobante')?.setValue('ERROR'),
          });
        } else {
          this.salesForm.get('numeroComprobante')?.setValue('');
        }
      });
  }

  get detalles(): FormArray {
    return this.salesForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [{ value: 0, disabled: true }],
    });

    // Cuando cambia el producto, autocompletar precio
    detalleGroup.get('producto')?.valueChanges.subscribe((producto) => {
      const p = producto as unknown as Product;
      if (p && p.precio_venta != null) {
        detalleGroup.get('precioUnitario')?.setValue(p.precio_venta);
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
    const detalles = this.salesForm.getRawValue().detalles || [];
    const { subTotal, igv, total } = this.ventaUtils.calcularMontos(detalles);
    this.salesForm.get('subTotal')?.setValue(subTotal, { emitEvent: false });
    this.salesForm.get('igv')?.setValue(igv, { emitEvent: false });
    this.salesForm.get('total')?.setValue(total, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.salesForm.valid) {
      this.calcularTotal();

      const formValue = this.salesForm.getRawValue();
      const total = this.salesForm.get('totalVenta')?.value;

      // Validar que todos los productos estén definidos
      const detallesValidos = formValue.detalles.every(
        (d: any) => d.producto && d.producto.productoId,
      );

      if (!detallesValidos) {
        Swal.fire({
          icon: 'warning',
          title: 'Producto no seleccionado',
          text: 'Asegúrate de seleccionar todos los productos antes de guardar.',
        });
        return;
      }

      const sale = {
        clienteId: formValue.cliente.clienteId,
        empleadoId: formValue.empleado.empleadoId,
        tipoComprobante: formValue.tipoComprobante,
        numeroComprobante: formValue.numeroComprobante,
        serie: formValue.serie,
        moneda: formValue.moneda,
        fechaVenta: new Date().toISOString(),

        estado: formValue.estado,
        estadoPago: formValue.estadoPago,
        fecha_Creacion: formValue.fecha_Creacion,

        detalles: formValue.detalles.map((d: any) => ({
          productoId: d.producto.productoId,
          cantidad: d.cantidad,
        })),
      };

      this.saleService.createSales(sale as any).subscribe({
        next: (response) => {
          const nro = response?.numeroComprobante;
          if (nro) {
            this.salesForm.get('numeroComprobante')?.setValue(nro);
          }

          Swal.fire({
            icon: 'success',
            title: 'Venta creada',
            text: nro
              ? `Comprobante generado: ${nro}`
              : 'La venta ha sido registrada exitosamente.',

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
