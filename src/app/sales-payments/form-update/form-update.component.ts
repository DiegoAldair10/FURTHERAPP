import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { SalesPayments } from '../../model/salesPayments';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

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

  ],
  templateUrl: './form-update.component.html',
  styleUrl: './form-update.component.css'
})
export class FormUpdateComponent {
  salePayment!: SalesPayments;
  displayedColumns = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];

constructor(
  public dialogRef: MatDialogRef<FormUpdateComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { salesPayment: SalesPayments }
) {
  this.salePayment = data.salesPayment; // 👈 importante
  console.log('DATA RECIBIDA EN DIALOG:', this.salePayment);
}


 cerrar(event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    this.dialogRef.close();
  }

    
  printPago(): void {
    const pagoElement = document.querySelector(
      '.pago-container'
    ) as HTMLElement;

    if (!pagoElement) {
      console.error('No se encontró la vista de pago.');
      return;
    }

    const pagoHTML = pagoElement.outerHTML;

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
        <title>${this.salePayment.tipoComprobante}: ${this.salePayment.numeroComprobante}</title>
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
        ${pagoHTML}
      </body>
    </html>
  `);
    ventanaImpresion.document.close();
  }
}
