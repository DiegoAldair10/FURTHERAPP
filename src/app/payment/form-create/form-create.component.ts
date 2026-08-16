import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  Form,
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
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { BuysService } from '../../services/buys.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-create',
  imports: [
    CommonModule,
    CurrencyPipe,         // <-- AGREGAR AQUÍ
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,      // <-- AGREGAR AQUÍ (Resuelve el error de <mat-select>)
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule         // <-- AGREGAR AQUÍ
],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private buysService = inject(BuysService);
  private paymentService = inject(PaymentService);
  // private salesService = inject(SalesService);

  public dialogRef = inject(MatDialogRef<FormCreateComponent>);

  paymentForm: FormGroup;
  comprasPendientes: any[] = [];
  ventasPendientes: any[] = [];
  metodosPago: any[] = [];
  detalleSeleccionado: any = null;

  constructor() {
    this.paymentForm = this.fb.group({
      tipoOperacion: ['COMPRA', Validators.required],
      compraId: ['', Validators.required],
      ventaId: [''],
      metodoPagoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarComprasPendientes();
    this.cargarMetodosPago();
    // this.cargarVentasPendientes();
  }

  cargarComprasPendientes(): void {
    this.buysService.obtenerTodasCompras().subscribe({
      next: (compras) => {
        this.comprasPendientes = compras.filter((c: any) => c.estadoPago === 'PENDIENTE');
      },
      error: (err) => console.error('Error al cargar compras pendientes', err)
    });
  }

  cargarMetodosPago(): void {
    this.paymentService.getPayments().subscribe({
      next: (metodos) => this.metodosPago = metodos,
      error: (err) => console.error('Error al cargar métodos de pago', err)
    });
  }

  // 1. MÉTODO AL CAMBIAR ENTRE VENTA Y COMPRA (Resuelve error en HTML)
  onTipoOperacionChange(tipo: string): void {
    this.detalleSeleccionado = null;
    
    if (tipo === 'COMPRA') {
      this.paymentForm.get('compraId')?.setValidators([Validators.required]);
      this.paymentForm.get('ventaId')?.clearValidators();
      this.paymentForm.get('ventaId')?.reset();
    } else {
      this.paymentForm.get('ventaId')?.setValidators([Validators.required]);
      this.paymentForm.get('compraId')?.clearValidators();
      this.paymentForm.get('compraId')?.reset();
    }
    
    this.paymentForm.get('compraId')?.updateValueAndValidity();
    this.paymentForm.get('ventaId')?.updateValueAndValidity();
  }

  // 2. MÉTODO AL SELECCIONAR UNA COMPRA (Resuelve error en HTML)
  onCompraSeleccionada(compraId: number): void {
    const compra = this.comprasPendientes.find(c => c.id === compraId);
    if (compra) {
      this.detalleSeleccionado = {
        total: compra.totalCompra,
        tipoComprobante: compra.tipoComprobante,
        numero: compra.numero,
        entidadNombre: compra.proveedor?.nombre || 'Proveedor'
      };
    }
  }

  // 3. MÉTODO AL SELECCIONAR UNA VENTA (Resuelve error en HTML)
  onVentaSeleccionada(ventaId: number): void {
    const venta = this.ventasPendientes.find(v => v.ventaId === ventaId);
    if (venta) {
      this.detalleSeleccionado = {
        total: venta.total,
        tipoComprobante: venta.tipoComprobante,
        numero: venta.numeroComprobante || venta.ventaId,
        entidadNombre: venta.clienteNombre
      };
    }
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) return;

    const { tipoOperacion, compraId, metodoPagoId } = this.paymentForm.value;

    if (tipoOperacion === 'COMPRA') {
      this.buysService.pagarCompra(compraId, metodoPagoId).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Pago registrado',
            text: 'El estado de la compra ha cambiado a PAGADA.',
            confirmButtonColor: '#3085d6'
          }).then(() => this.dialogRef.close(true));
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el pago de la compra.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      // Aquí iría tu lógica para procesar pagos de Ventas cuando la tengas lista
      console.log('Pago de venta enviado:', this.paymentForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}