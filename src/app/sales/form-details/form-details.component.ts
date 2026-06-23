import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DetailSale } from '../../model/detailSale';
import { Product } from '../../model/product';
import { Sales } from '../../model/sales';
import { CustomerService } from '../../services/customer.service';
import { EmployeeService } from '../../services/employee.service';
import { ProductService } from '../../services/product.service';
import { FormUpdateComponent } from '../form-update/form-update.component';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatIcon } from '@angular/material/icon';
// Asignar fuentes PDFMake
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-form-details',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
  ],
  templateUrl: './form-details.component.html',
  styleUrl: './form-details.component.css',
})
export class FormDetailsComponent implements OnInit {
  sale!: Sales;
  products: Product[] = [];
  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  private productoService = inject(ProductService);
  private clienteService = inject(CustomerService);
  private empleadoService = inject(EmployeeService);

  constructor(
    public dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sale: Sales },
  ) {
    this.sale = data.sale;
  }
  ngOnInit(): void {
    // Cargar productos
    this.productoService.getProducts().subscribe((productos) => {
      this.products = productos;

      if (this.sale?.detalles) {
        this.sale.detalles = this.sale.detalles.map((detalle: any) => {
          const productoCompleto = productos.find(
            (p) => p.productoId === detalle.productoId,
          );
          return {
            ...detalle,
            producto: productoCompleto ?? {
              productoId: detalle.productoId,
              nombre: 'Producto no encontrado',
              descripcion: '',
              precio: 0,
              categoria: '',
              stock: 0,
              fechaCreacion: new Date().toISOString(),
            },
          };
        });
      }
    });
  }

  calcularSubtotal(detalle: any): number {
    return Number(detalle.subtotal || 0);
  }

  cerrar(event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    this.dialogRef.close();
  }

  printBoleta(): void {
    const detalles = (this.sale.detalles || [])
      .map(
        (d: any) => `
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
    `,
      )
      .join('');

    const ventana = window.open('', '_blank', 'width=900,height=1000');

    if (!ventana) {
      return;
    }

    ventana.document.write(`
  <html>

  <head>

    <title>Detalle de Venta</title>

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

          <h2>DETALLE DE VENTA</h2>

          <div>
            ${this.sale.tipoComprobante}
            -
            ${this.sale.numeroComprobante}
          </div>

          <div class="estado">
            ${this.sale.estado}
          </div>

        </div>

      </div>

    </div>

    <div class="info">

      <div class="info-grid">

        <div class="info-card">
          <span>Cliente</span>
          <strong>${this.sale.clienteNombre}</strong>
        </div>

        <div class="info-card">
          <span>Empleado</span>
          <strong>${this.sale.empleadoNombre}</strong>
        </div>

        <div class="info-card">
          <span>Fecha de Creación</span>
          <strong>
            ${new Date(this.sale.fecha_Creacion).toLocaleString()}
          </strong>
        </div>

      <div class="info-card">
          <span>Fecha de Venta</span>
          <strong>
            ${new Date(this.sale.fechaVenta).toLocaleString()}
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
          S/ ${Number(this.sale.subTotal).toFixed(2)}
        </strong>
      </div>
<div>
        <span>IGV</span>
        <strong>
          S/ ${Number(this.sale.igv).toFixed(2)}
        </strong>
      </div>
      <div class="total-final">
        <span>TOTAL APAGAR</span>
        <span>
          S/ ${Number(this.sale.total).toFixed(2)}
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
