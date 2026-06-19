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
  ],
  templateUrl: './form-details.component.html',
  styleUrl: './form-details.component.css'
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
    @Inject(MAT_DIALOG_DATA) public data: { sale: Sales }
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
            (p) => p.productoId === detalle.productoId
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
    const boletaElement = document.querySelector(
      '.boleta-container'
    ) as HTMLElement;

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
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((el) => el.outerHTML)
      .join('\n');

    ventanaImpresion.document.write(`
    <html>
      <head>
        <title>${this.sale.tipoComprobante}: ${this.sale.numeroComprobante}</title>
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
