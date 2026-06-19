import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import Swal from 'sweetalert2';
import { SalesService } from '../../services/sales.service';
import { CustomerService } from '../../services/customer.service';
import { EmployeeService } from '../../services/employee.service';
import { ProductService } from '../../services/product.service';
import { VentaUtilsService } from '../../services/venta-utils.service';
import { Product } from '../../model/product';
import { forkJoin } from 'rxjs';
import { Sales } from '../../model/sales';

@Component({
  selector: 'app-form-update',
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
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.css'],
})
export class FormUpdateComponent implements OnInit {
  salesForm: FormGroup;
  isUpdating = false;

  customers: any[] = [];
  employees: any[] = [];
  products: Product[] = [];

  comprobantes = [{ nombre: 'BOLETA' }, { nombre: 'FACTURA' }];

  // IGV_RATE ahora se gestiona en VentaUtilsService

  constructor(
    private fb: FormBuilder,
    private saleService: SalesService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private productService: ProductService,
    private ventaUtils: VentaUtilsService,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venta: Sales },
  ) {
    // Inicializamos el formulario vacío
    this.salesForm = this.fb.group({
      cliente: [null, Validators.required],
      empleado: [null, Validators.required],
      tipoComprobante: ['', Validators.required],
      numeroComprobante: ['', Validators.required],
      serie: [''],
      moneda: [''],
      fechaVenta: [null, Validators.required],
      subTotal: [0],
      igv: [0],
      total: [0],
      estado: [''],
      estadoPago: [''],
      fecha_Creacion: [null, Validators.required],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  get detalles(): FormArray {
    return this.salesForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      producto: [null as Product | null, Validators.required],
      cantidad: [1, Validators.required],
      precioUnitario: [{ value: 0, disabled: true }],
    });

    // Autocompletar precio al seleccionar producto
    detalleGroup
      .get('producto')
      ?.valueChanges.subscribe((producto: Product | null) => {
        detalleGroup
          .get('precioUnitario')
          ?.setValue(producto?.precio_venta ?? 0);
        this.calcularMontos();
      });

    detalleGroup
      .get('cantidad')
      ?.valueChanges.subscribe(() => this.calcularMontos());
    detalleGroup
      .get('precioUnitario')
      ?.valueChanges.subscribe(() => this.calcularMontos());

    this.detalles.push(detalleGroup);
    this.calcularMontos();
  }

  eliminarDetalle(index: number): void {
    this.detalles.removeAt(index);
    this.calcularMontos();
  }

  cargarDatos(): void {
    forkJoin({
      customers: this.customerService.getCustomers(),
      employees: this.employeeService.getEmployees(),
      products: this.productService.getProducts(),
    }).subscribe(({ customers, employees, products }) => {
      this.customers = customers;
      this.employees = employees;
      this.products = products;

      if (!this.data.venta) {
        this.dialogRef.close();
        return;
      }

      // Parcheamos formulario con datos de la venta
      this.salesForm.patchValue({
        cliente: customers.find(
          (c) => c.clienteId === this.data.venta.clienteId,
        ),
        empleado: employees.find(
          (e) => e.empleadoId === this.data.venta.empleadoId,
        ),
        tipoComprobante: this.data.venta.tipoComprobante,
        numeroComprobante: this.data.venta.numeroComprobante,
        serie: this.data.venta.serie,
        moneda: this.data.venta.moneda,
        fechaVenta: this.data.venta.fechaVenta
          ? formatDate(this.data.venta.fechaVenta)
          : null,
        subTotal: this.data.venta.subTotal,
        igv: this.data.venta.igv,
        total: this.data.venta.total,
        estado: this.data.venta.estado,
        estadoPago: this.data.venta.estadoPago,
        fecha_Creacion: this.data.venta.fecha_Creacion
          ? formatDate(this.data.venta.fecha_Creacion)
          : null,
      });

      // Cargar detalles
      const detallesArray = this.detalles;
      detallesArray.clear();
      this.data.venta.detalles?.forEach((d) => {
        const detalleGroup = this.fb.group({
          producto: [
            products.find((p) => p.productoId === d.productoId) ??
              (null as Product | null),
            Validators.required,
          ],
          cantidad: [d.cantidad, Validators.required],
          precioUnitario: [d.precioUnitario, Validators.required],
        });

        detalleGroup
          .get('producto')
          ?.valueChanges.subscribe((producto: Product | null) => {
            detalleGroup
              .get('precioUnitario')
              ?.setValue(producto?.precio_venta ?? 0);
            this.calcularMontos();
          });
        detalleGroup
          .get('cantidad')
          ?.valueChanges.subscribe(() => this.calcularMontos());
        detalleGroup
          .get('precioUnitario')
          ?.valueChanges.subscribe(() => this.calcularMontos());

        detallesArray.push(detalleGroup);
      });

      this.calcularMontos();
    });
  }

  onTipoComprobanteChange(value: string): void {
    if (value === 'BOLETA') {
      this.salesForm.patchValue({ serie: 'B001' });
    } else if (value === 'FACTURA') {
      this.salesForm.patchValue({ serie: 'F001' });
    }
  }

  calcularMontos(): void {
    const detalles = this.salesForm.getRawValue().detalles || [];
    const { subTotal, igv, total } = this.ventaUtils.calcularMontos(detalles);
    this.salesForm.get('subTotal')?.setValue(subTotal, { emitEvent: false });
    this.salesForm.get('igv')?.setValue(igv, { emitEvent: false });
    this.salesForm.get('total')?.setValue(total, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.salesForm.valid && !this.isUpdating) {
      this.isUpdating = true;

      const formValue = this.salesForm.getRawValue();

      const updatedSale = {
        clienteId: formValue.cliente.clienteId,
        empleadoId: formValue.empleado.empleadoId,
        tipoComprobante: formValue.tipoComprobante,
        numeroComprobante: formValue.numeroComprobante,
        serie: formValue.serie,
        moneda: formValue.moneda,
        fechaVenta: formValue.fechaVenta,
        estado: formValue.estado,
        estadoPago: formValue.estadoPago,
        fecha_Creacion: formValue.fecha_Creacion,
        detalles: formValue.detalles.map((d: any) => ({
          productoId: d.producto.productoId,
          cantidad: d.cantidad,
        })),
      };

      this.saleService
        .updateSales(this.data.venta.ventaId, updatedSale)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Venta actualizada',
              text: 'Los cambios han sido guardados.',
              confirmButtonColor: '#3085d6',
            }).then(() => this.dialogRef.close(response));
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar la venta.',
              confirmButtonColor: '#d33',
            });
            this.isUpdating = false;
          },
        });
    }
  }

  closeDialogUpdate(): void {
    this.dialogRef.close();
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toISOString().split('T')[0];
}
