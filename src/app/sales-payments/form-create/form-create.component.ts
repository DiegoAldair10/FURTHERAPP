import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { SalesPaymentsService } from '../../services/sales-payments.service';
import { SalesService } from '../../services/sales.service';
import { PaymentService } from '../../services/payment.service';

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
    MatCardModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private salesPaymentsService = inject(SalesPaymentsService);
  private salesService = inject(SalesService);
  private paymentService = inject(PaymentService);

  sales: any[] = [];
  payments: any[] = [];

  salesPaymentsForm: FormGroup;

  selectedComprobante: string | null = null;
  selectedNumero: string | null = null;
  selectedCliente: string | null = null;
  selectedEmpleado: string | null = null;
  selectedTipoComprobante: string | null = null;
  selectedTotal: number | null = null;
  selectedDetalles: any[] = [];
  selectFechaPago: Date | null = null;

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.salesPaymentsForm = this.fb.group({
      ventaId: [null, Validators.required],
      metodoPagoId: [null, Validators.required],
      monto: [
        { value: null, disabled: true },
        [Validators.required, Validators.min(0.01)],
      ],
      fecha_Pago: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarMetodosPago();
    this.detectarVentaSeleccionada();
  }

  cargarVentas(): void {
    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      },
    });
  }

  cargarMetodosPago(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (error) => {
        console.error('Error al cargar métodos de pago:', error);
      },
    });
  }

  detectarVentaSeleccionada(): void {
    this.salesPaymentsForm.get('ventaId')?.valueChanges.subscribe((ventaId) => {
      const venta = this.sales.find((s) => s.ventaId === ventaId);

      if (!venta) {
        this.limpiarDetalleVenta();
        return;
      }

      this.selectedComprobante = venta.tipoComprobante || '---';
      this.selectedNumero = venta.numeroComprobante || '---';
      this.selectedCliente = venta.clienteNombre || '---';
      this.selectedEmpleado = venta.empleadoNombre || '---';
      this.selectedTipoComprobante = venta.tipoComprobante || '---';
      this.selectFechaPago = venta.fechaVenta
        ? new Date(venta.fechaVenta)
        : null;
      this.selectedTotal = Number(venta.total ?? venta.totalVenta ?? 0);
      this.selectedDetalles = venta.detalles || [];

      this.salesPaymentsForm.patchValue({
        monto: this.selectedTotal,
      });
    });
  }

  limpiarDetalleVenta(): void {
    this.selectedComprobante = null;
    this.selectedNumero = null;
    this.selectedCliente = null;
    this.selectedEmpleado = null;
    this.selectedTipoComprobante = null;
    this.selectedTotal = null;
    this.selectedDetalles = [];
    this.selectFechaPago = null;

    this.salesPaymentsForm.patchValue({
      monto: this.selectedTotal,
    });
  }

  onSubmit(): void {
    if (this.salesPaymentsForm.invalid) {
      this.salesPaymentsForm.markAllAsTouched();
      return;
    }

    const formValue = this.salesPaymentsForm.getRawValue();

    const rawFecha = formValue.fecha_Pago;
    const parsedDate = rawFecha ? new Date(rawFecha) : null;

    let fechaIso: string | null = null;

    if (parsedDate && !isNaN(parsedDate.getTime())) {
      fechaIso = parsedDate.toISOString();
    }

    const salesPayments = {
      ventaId: formValue.ventaId,
      metodoPagoId: formValue.metodoPagoId,
      monto: formValue.monto,
      fecha_Pago: fechaIso,
    };

    const ventaSeleccionada = this.sales.find(
      (s) => s.ventaId === this.salesPaymentsForm.value.ventaId,
    );

    if (ventaSeleccionada && ventaSeleccionada.estadoPago === 'PAGADA') {
      Swal.fire({
        icon: 'warning',
        title: 'Venta ya pagada',
        text: 'Esta venta ya tiene un pago registrado.',
        confirmButtonColor: '#f59e0b',
      });

      return;
    }

    this.salesPaymentsService
      .createSalesPayment(salesPayments as any)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Pago creado',
            text: 'El pago ha sido registrado exitosamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.dialogRef.close(response);
          });
        },

        error: (error) => {
          console.error('Error backend:', error);

          let mensaje = 'No se pudo registrar el pago';

          if (error.error?.message) {
            mensaje = error.error.message;
          } else if (typeof error.error === 'string') {
            mensaje = error.error;
          }

          // VALIDACIÓN DE PAGO DUPLICADO
          if (mensaje.toLowerCase().includes('ya tiene un pago')) {
            Swal.fire({
              icon: 'warning',
              title: 'Pago duplicado',
              text: mensaje,
              confirmButtonColor: '#f59e0b',
            });

            return;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonColor: '#d33',
          });
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
