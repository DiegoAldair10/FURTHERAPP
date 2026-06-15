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
import { SalesPaymentsService } from '../../services/sales-payments.service';
import { SalesService } from '../../services/sales.service';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-form-create',
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
  salesPaymentsForm!: FormGroup;

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
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha_Pago: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    // 🔹 Traer las ventas
    this.salesService.getSales().subscribe((data) => {
      console.log('Ventas:', data);
      this.sales = data;
    });

    // 🔹 Traer métodos de pago
    this.paymentService.getPayments().subscribe((data) => {
      console.log('Métodos de pago:', data);
      this.payments = data;
    });

    this.salesPaymentsForm.get('ventaId')?.valueChanges.subscribe((ventaId) => {
      const venta = this.sales.find((s) => s.ventaId === ventaId);
      if (venta) {
        this.selectedComprobante = venta.tipoComprobante || '---';
        this.selectedNumero = venta.numeroComprobante || '---';
        this.selectedCliente = venta.clienteNombre || '---';
        this.selectedEmpleado = venta.empleadoNombre || '---';
        this.selectedTipoComprobante = venta.tipoComprobante || '---';
        this.selectFechaPago = venta.fechaVenta
          ? new Date(venta.fechaVenta)
          : null;
        // El modelo Sales usa la propiedad 'total'
        this.selectedTotal = venta.total ?? venta.totalVenta ?? 0;
        console.log(
          'Venta seleccionada:',
          venta,
          'selectedTotal:',
          this.selectedTotal
        );

        // 👇 importante: traer los detalles (array)
        this.selectedDetalles = venta.detalles || [];
      } else {
        this.selectedComprobante = null;
        this.selectedNumero = null;
        this.selectedCliente = null;
        this.selectedEmpleado = null;
        this.selectedTipoComprobante = null;
        this.selectedTotal = null;
        this.selectedDetalles = [];
      }
    });
  }

  onSubmit(): void {
    if (this.salesPaymentsForm.valid) {
      // Obtener el valor real del control (se definió como 'fecha_Pago' en el form)
      const rawFecha: any =
        this.salesPaymentsForm.get('fecha_Pago')?.value ??
        this.salesPaymentsForm.value.fechaPago;

      // Validar que la fecha sea válida antes de convertirla a ISO
      let fechaIso: string | null = null;
      const parsedDate = rawFecha ? new Date(rawFecha) : null;
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        fechaIso = parsedDate.toISOString();
      }

      const salesPayments: any = {
        ...this.salesPaymentsForm.value,
        // Enviar la fecha en formato ISO sólo si es válida, si no enviamos null
        fechaPago: fechaIso,
      };

      this.salesPaymentsService.createSalesPayment(salesPayments).subscribe({
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
          let errorMessage = 'Ocurrió un error al registrar el pago.';
          if (error.status === 400 && error.error?.message) {
            errorMessage = error.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
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
