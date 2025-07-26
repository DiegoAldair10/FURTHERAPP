import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { Sales } from '../../model/sales';
import { DetailSale } from '../../model/detailSale';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

// Asignar fuentes PDFMake
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-form-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.css']
})
export class FormUpdateComponent implements OnInit {
  sale!: Sales;
  products: Product[] = [];
  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

  private productoService = inject(ProductService);

  constructor(
    public dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sale: Sales }
  ) {
    this.sale = data.sale;
  }

  ngOnInit(): void {
    this.productoService.getProducts().subscribe((productos) => {
      this.products = productos;

      this.sale.detalles = this.sale.detalles.map((detalle) => {
        const productoId =
          detalle.producto?.productoId ?? (detalle as any).productoId;

        const productoCompleto = productos.find(
          (p) => p.productoId === productoId
        );

        return {
          ...detalle,
          producto:
            productoCompleto ?? {
              productoId,
              nombre: '',
              descripcion: '',
              precio: 0,
              categoria: '',
              stock: 0,
              fechaCreacion: new Date().toISOString()
            } as unknown as Product
        };
      });
    });
  }

  calcularSubtotal(detalle: DetailSale): number {
    const cantidad = Number(detalle.cantidad);
    const precioUnitario = Number(detalle.precioUnitario);
    return cantidad * precioUnitario;
  }

  cerrar(event: Event): void {
      (event.currentTarget as HTMLElement).blur();
    this.dialogRef.close();
  }
printBoleta(): void {
  const boletaElement = document.querySelector('.boleta-container') as HTMLElement;

  if (!boletaElement) {
    console.error('No se encontró la boleta.');
    return;
  }

  const boletaHTML = boletaElement.outerHTML;

  const ventanaImpresion = window.open('', '_blank', 'width=800,height=1000');
  if (!ventanaImpresion) {
    console.error('No se pudo abrir la ventana de impresión.');
    return;
  }

  // Obtiene los estilos aplicados desde el documento principal
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  ventanaImpresion.document.write(`
    <html>
      <head>
        <title>Boleta de Venta</title>
        ${styles}
        <style>
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${boletaHTML}
      </body>
    </html>
  `);
  ventanaImpresion.document.close();
}

}
