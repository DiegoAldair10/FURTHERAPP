import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { SalesPayments } from '../../model/salesPayments';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-form-update',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIcon,
  ],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css',
})
export class FormUpdateComponent {
  salePayment!: SalesPayments;
  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  constructor(
    public dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { salesPayment: SalesPayments },
  ) {
    this.salePayment = data.salesPayment; // 👈 importante
    console.log('DATA RECIBIDA EN DIALOG:', this.salePayment);
  }

  cerrar(event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    this.dialogRef.close();
  }

 printPago(): void {

  const detalles = (this.salePayment.detalles || [])
    .map((d: any) => `
      <tr>
        <td>${d.producto?.nombre || d.productoNombre}</td>
        <td style="text-align:center">${d.cantidad}</td>
        <td style="text-align:right">
          S/ ${Number(d.precioUnitario).toFixed(2)}
        </td>
        <td style="text-align:right">
          S/ ${Number(d.subtotal).toFixed(2)}
        </td>
      </tr>
    `)
    .join('');

  const ventana = window.open(
    '',
    '_blank',
    'width=900,height=1000'
  );

  if (!ventana) {
    return;
  }

  ventana.document.write(`
  <html>

  <head>

    <title>Comprobante de Pago</title>

    <style>

      body{
        font-family: Arial, sans-serif;
        padding:25px;
        color:#222;
      }

      .header{
        border-bottom:3px solid #16a34a;
        padding-bottom:15px;
        margin-bottom:20px;
      }

      .empresa{
        font-size:32px;
        font-weight:900;
        color:#16a34a;
      }

      .subtitulo{
        color:#666;
        font-size:13px;
      }

      .comprobante{
        text-align:right;
      }

      .comprobante h2{
        margin:0;
      }

      .estado{
        display:inline-block;
        margin-top:10px;
        background:#dcfce7;
        color:#16a34a;
        padding:8px 16px;
        border-radius:20px;
        font-weight:bold;
      }

      .info{
        margin-top:20px;
      }

      .info-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .info-card{
        border:1px solid #ddd;
        padding:10px;
        border-radius:8px;
      }

      .info-card span{
        display:block;
        font-size:12px;
        color:#666;
      }

      table{
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
      }

      thead{
        background:#16a34a;
        color:white;
      }

      th{
        padding:10px;
      }

      td{
        border:1px solid #ddd;
        padding:10px;
      }

      .totales{
        width:320px;
        margin-left:auto;
        margin-top:20px;
      }

      .totales div{
        display:flex;
        justify-content:space-between;
        margin-bottom:8px;
      }

      .total-final{
        border-top:2px solid #16a34a;
        padding-top:10px;
        margin-top:10px;
        font-size:22px;
        font-weight:bold;
        color:#16a34a;
      }

      .footer{
        text-align:center;
        margin-top:40px;
        color:#666;
      }

    </style>

  </head>

  <body>

    <div class="header">

      <div style="display:flex;justify-content:space-between;align-items:flex-start;">

        <div>

          <div class="empresa">
            SCANET
          </div>

          <div class="subtitulo">
            Sistema de Gestión Comercial
          </div>

        </div>

        <div class="comprobante">

          <h2>COMPROBANTE DE PAGO</h2>

          <div>
            ${this.salePayment.tipoComprobante}
            -
            ${this.salePayment.numeroComprobante}
          </div>

          <div class="estado">
            PAGADA
          </div>

        </div>

      </div>

    </div>

    <div class="info">

      <div class="info-grid">

        <div class="info-card">
          <span>Cliente</span>
          <strong>${this.salePayment.clienteNombre}</strong>
        </div>

        <div class="info-card">
          <span>Empleado</span>
          <strong>${this.salePayment.empleadoNombre}</strong>
        </div>

        <div class="info-card">
          <span>Método de Pago</span>
          <strong>${this.salePayment.nombre}</strong>
        </div>

        <div class="info-card">
          <span>Fecha</span>
          <strong>
            ${new Date(this.salePayment.fecha_Pago).toLocaleString()}
          </strong>
        </div>

      </div>

    </div>

    <table>

      <thead>

        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>

      </thead>

      <tbody>

        ${detalles}

      </tbody>

    </table>

    <div class="totales">

      <div>
        <span>Subtotal</span>
        <strong>
          S/ ${Number(this.salePayment.totalVenta).toFixed(2)}
        </strong>
      </div>

      <div class="total-final">
        <span>TOTAL PAGADO</span>
        <span>
          S/ ${Number(this.salePayment.totalVenta).toFixed(2)}
        </span>
      </div>

    </div>

    <div class="footer">
      Gracias por su pago<br>
      SCANET ERP
    </div>

    <script>

      window.onload = function() {

        window.print();

        window.close();

      }

    </script>

  </body>

  </html>
  `);

  ventana.document.close();
}


}
