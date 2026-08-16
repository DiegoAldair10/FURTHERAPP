import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Purchase } from '../../model/purchase';
import { ProductService } from '../../services/product.service'; // Ajusta la ruta a tu servicio
import { Product } from '../../model/product';

@Component({
  selector: 'app-form-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './form-details.component.html',
  styleUrl: './form-details.component.css',
})
export class FormDetailsComponent implements OnInit {
  compra!: Purchase;
  products: Product[] = [];
  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  private productoService = inject(ProductService);

  constructor(
    public dialogRef: MatDialogRef<FormDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { compra: Purchase }
  ) {
    this.compra = data.compra;
  }

  ngOnInit(): void {
    // Cargar productos para mapear nombres si los detalles solo traen productoId
    this.productoService.getProducts().subscribe((productos) => {
      this.products = productos;

      if (this.compra?.detalles) {
        this.compra.detalles = this.compra.detalles.map((detalle: any) => {
          const productoCompleto = productos.find(
            (p) => p.productoId === detalle.productoId
          );
          return {
            ...detalle,
            producto: productoCompleto ?? {
              productoId: detalle.productoId,
              nombre: detalle.productoNombre || detalle.producto?.nombre || 'Producto no encontrado',
            },
          };
        });
      }
    });
  }

  getSimboloMoneda(): string {
    return this.compra?.moneda === 'USD' ? '$' : 'S/';
  }

  cerrar(event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    this.dialogRef.close();
  }

  printBoleta(): void {
    const simbolo = this.getSimboloMoneda();
    
    // Obtener nombre del proveedor según cómo venga estructurado en el JSON
    const proveedorNombre = 
      typeof this.compra.proveedorNombre === 'string' 
        ? this.compra.proveedorNombre 
        : (this.compra.proveedorNombre as any)?.nombre || 'Sin Proveedor';

    const detallesHtml = (this.compra.detalles || [])
      .map(
        (d: any) => `
      <tr>
        <td>${d.producto?.nombre || d.productoNombre || 'Producto'}</td>
        <td style="text-align:center">${d.cantidad}</td>
        <td style="text-align:right">
          ${simbolo} ${Number(d.precioUnitario || d.precio).toFixed(2)}
        </td>
        <td style="text-align:right">
          ${simbolo} ${Number(d.subtotal || (d.cantidad * d.precioUnitario)).toFixed(2)}
        </td>
      </tr>
    `
      )
      .join('');

    const ventana = window.open('', '_blank', 'width=900,height=1000');

    if (!ventana) return;

    ventana.document.write(`
  <html>
  <head>
    <title>Detalle de Compra #${this.compra.compraId}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 25px; color: #222; }
      .header { border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
      .empresa { font-size: 32px; font-weight: 900; color: #2563eb; }
      .subtitulo { color: #666; font-size: 13px; }
      .comprobante { text-align: right; }
      .comprobante h2 { margin: 0; }
      .estado { display: inline-block; margin-top: 10px; background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
      .info-card { border: 1px solid #e5e7eb; padding: 10px; border-radius: 8px; background: #f9fafb; }
      .info-card span { display: block; font-size: 12px; color: #6b7280; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      thead { background: #2563eb; color: white; }
      th, td { padding: 10px; border: 1px solid #e5e7eb; text-align: left; }
      .totales { width: 300px; margin-left: auto; margin-top: 20px; }
      .totales div { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .total-final { border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; font-size: 20px; font-weight: bold; color: #2563eb; }
      .footer { text-align: center; margin-top: 40px; color: #6b7280; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div class="empresa">SCANET</div>
          <div class="subtitulo">Sistema de Gestión Comercial</div>
        </div>
        <div class="comprobante">
          <h2>ORDEN DE COMPRA</h2>
          <div>${this.compra.tipoComprobante || 'COMPROBANTE'} ${this.compra.serie ? '(' + this.compra.serie + '-' + this.compra.numero + ')' : ''}</div>
          <div class="estado">${this.compra.estado || 'REGISTRADA'}</div>
        </div>
      </div>
    </div>

    <div class="info">
      <div class="info-grid">
        <div class="info-card">
          <span>Proveedor</span>
          <strong>${proveedorNombre}</strong>
        </div>
        <div class="info-card">
          <span>Estado de Pago</span>
          <strong>${this.compra.estadoPago || 'PENDIENTE'}</strong>
        </div>
        <div class="info-card">
          <span>Fecha de Compra</span>
          <strong>${new Date(this.compra.fechaCompra).toLocaleString()}</strong>
        </div>
        <div class="info-card">
          <span>Moneda</span>
          <strong>${this.compra.moneda || 'PEN'}</strong>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align:center">Cantidad</th>
          <th style="text-align:right">Precio Unitario</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${detallesHtml}
      </tbody>
    </table>

    <div class="totales">
      <div>
        <span>Subtotal</span>
        <strong>${simbolo} ${Number(this.compra.subtotal || 0).toFixed(2)}</strong>
      </div>
      <div>
        <span>IGV</span>
        <strong>${simbolo} ${Number(this.compra.igv || 0).toFixed(2)}</strong>
      </div>
      <div class="total-final">
        <span>TOTAL COMPRA</span>
        <span>${simbolo} ${Number(this.compra.totalCompra || 0).toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      Documento generado automáticamente por SCANET ERP
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