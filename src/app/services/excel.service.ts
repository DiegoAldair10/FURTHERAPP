import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportarKardex(reportes: any[]): void {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Informe Kardex');

    // Desactivar líneas de cuadrícula no estándar y asegurar vista limpia
    worksheet.views = [{ showGridLines: true }];

    // ----------------------------------------------------
    // 1. ENCABEZADO INSTITUCIONAL
    // ----------------------------------------------------
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'FURTHER S.A. - INFORME TÉCNICO DE KARDEX';
    titleCell.font = { name: 'Calibri', bold: true, size: 16, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } }; // Slate 800
    titleCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    worksheet.getRow(1).height = 40;

    // Subtítulo e información de generación
    worksheet.mergeCells('A2:H2');
    const subCell = worksheet.getCell('A2');
    subCell.value = `Gestión de Control de Inventarios | Emisión: ${new Date().toLocaleString()}`;
    subCell.font = { name: 'Calibri', italic: true, size: 10, color: { argb: '64748B' } };
    subCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    worksheet.getRow(2).height = 20;

    worksheet.addRow([]); // Espaciador (Fila 3)

    // ----------------------------------------------------
    // 2. RESUMEN EJECUTIVO (KPIs)
    // ----------------------------------------------------
    const totalRegistros = reportes.length;
    const totalCantidad = reportes.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);

    // KPI 1: Total Registros
    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = 'TOTAL MOVIMIENTOS:';
    worksheet.getCell('A4').font = { bold: true, size: 9, color: { argb: '475569' } };
    worksheet.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
    worksheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A5:B5');
    worksheet.getCell('A5').value = totalRegistros;
    worksheet.getCell('A5').font = { bold: true, size: 13, color: { argb: '0F172A' } };
    worksheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
    worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };

    // KPI 2: Unidades Procesadas
    worksheet.mergeCells('D4:E4');
    worksheet.getCell('D4').value = 'UNIDADES PROCESADAS:';
    worksheet.getCell('D4').font = { bold: true, size: 9, color: { argb: '475569' } };
    worksheet.getCell('D4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
    worksheet.getCell('D4').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('D5:E5');
    worksheet.getCell('D5').value = totalCantidad;
    worksheet.getCell('D5').font = { bold: true, size: 13, color: { argb: '0284C7' } };
    worksheet.getCell('D5').numFmt = '#,##0';
    worksheet.getCell('D5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
    worksheet.getCell('D5').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getRow(4).height = 18;
    worksheet.getRow(5).height = 24;

    worksheet.addRow([]); // Espaciador (Fila 6)

    // ----------------------------------------------------
    // 3. CABECERA DE LA TABLA
    // ----------------------------------------------------
    const headers = [
      'Fecha',
      'Producto',
      'Tipo Movimiento',
      'Origen / Destino',
      'Cantidad',
      'Stock Anterior',
      'Stock Nuevo',
      'Observación'
    ];

    const headerRow = worksheet.addRow(headers); // Fila 7
    headerRow.height = 26;

    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '334155' } // Slate 700
      };
      cell.font = {
        name: 'Calibri',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFF' }
      };
      // Alineación: derecha para numéricos, centro para fecha, izquierda para texto
      cell.alignment = {
        vertical: 'middle',
        horizontal: colNumber >= 5 && colNumber <= 7 ? 'right' : (colNumber === 1 ? 'center' : 'left'),
        wrapText: true
      };
      cell.border = {
        top: { style: 'medium', color: { argb: '0F172A' } },
        bottom: { style: 'medium', color: { argb: '0F172A' } }
      };
    });

    // ----------------------------------------------------
    // 4. DATOS Y ESTILOS DE FILAS
    // ----------------------------------------------------
    const startRowIndex = 8;

    reportes.forEach((r, index) => {
      const row = worksheet.addRow([
        r.fecha || '-',
        r.producto || '-',
        r.tipoMov || '-',
        r.origen || '-',
        Number(r.cantidad) || 0,
        Number(r.stockAnterior) || 0,
        Number(r.stockNuevo) || 0,
        r.observacion || '-'
      ]);

      row.height = 20;
      const isEven = index % 2 === 0;
      const rowBgColor = isEven ? 'FFFFFF' : 'F8FAFC'; // Efecto cebra

      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 10, color: { argb: '1E293B' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBgColor } };

        // Alineación y formatos numéricos
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else if (colNumber >= 5 && colNumber <= 7) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0'; // Formato con separador de miles
          if (colNumber === 7) {
            cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '0F172A' } };
          }
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }

        // Bordes suaves entre filas
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } }
        };
      });
    });

    // ----------------------------------------------------
    // 5. FILA DE TOTALES
    // ----------------------------------------------------
    const lastDataRow = startRowIndex + reportes.length - 1;
    const totalRowIndex = lastDataRow + 1;

    const totalRow = worksheet.addRow([
      'TOTALES',
      '',
      '',
      '',
      { formula: `SUM(E${startRowIndex}:E${lastDataRow})` },
      '',
      '',
      ''
    ]);

    worksheet.mergeCells(`A${totalRowIndex}:D${totalRowIndex}`);
    totalRow.height = 22;

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', bold: true, size: 11, color: { argb: '0F172A' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
      cell.border = {
        top: { style: 'thin', color: { argb: '0F172A' } },
        bottom: { style: 'double', color: { argb: '0F172A' } } // Doble línea inferior tipo contable
      };

      if (colNumber === 1) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colNumber === 5) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      }
    });

    // ----------------------------------------------------
    // 6. AUTOAJUSTE INTELIGENTE DE COLUMNAS
    // ----------------------------------------------------
    worksheet.columns.forEach((column, colIndex) => {
      let maxLen = 0;
      
      // Evaluar largo desde la cabecera de tabla en adelante
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber >= 7 && rowNumber <= totalRowIndex) {
          const cellValue = row.getCell(colIndex + 1).value;
          const strVal = cellValue ? cellValue.toString() : '';
          if (strVal.length > maxLen) {
            maxLen = strVal.length;
          }
        }
      });

      // Dar margen de espacio y límites mínimo y máximo
      column.width = Math.max(maxLen + 4, 14);
    });

    // ----------------------------------------------------
    // 7. DESCARGA DEL ARCHIVO
    // ----------------------------------------------------
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Informe_Kardex_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  }
}