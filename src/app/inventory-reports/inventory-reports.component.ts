import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { FormsModule } from '@angular/forms';

import { InventoryReportsService } from '../services/inventory-reports.service';
import { Kardex } from '../model/kardex';
import { Product } from '../model/product';
import { PdfService } from '../services/pdf.service';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-inventory-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.css'],
})
export class InventoryReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'producto',
    'tipoMov',
    'cantidad',
    'stockAnterior',
    'stockNuevo',
    'origen',
    'observacion',
  ];
  productos: Product[] = [];
  productoId: number | null = null;
  tipoMov: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  reportes: Kardex[] = [];

  constructor(
    private reportService: InventoryReportsService,
    private pdfService: PdfService,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.listar();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.reportService.listarProductos().subscribe({
      next: (data) => {
        console.log(data);
        this.productos = data;
      },
      error: (err) => console.error(err),
    });
  }

  listar(): void {
    this.reportService.listarKardex().subscribe({
      next: (data) => {
        console.log(data);
        this.reportes = data;
      },

      error: (err) => console.error(err),
    });
  }

  buscar(): void {
    this.reportService
      .buscarKardex(
        this.productoId ?? undefined,
        this.tipoMov || undefined,
        this.fechaInicio || undefined,
        this.fechaFin || undefined,
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.reportes = data;
        },

        error: (err) => console.error(err),
      });
  }

  exportarPDF() {
    this.pdfService.exportarKardex(this.reportes);
  }

  exportarExcel() {
    this.excelService.exportarKardex(this.reportes);
  }

  limpiar(): void {
    this.productoId = null;
    this.tipoMov = '';
    this.fechaInicio = '';
    this.fechaFin = '';

    this.listar();
  }
}
