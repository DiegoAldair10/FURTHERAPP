import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  exportarKardex(reportes: any[]): void {

    // 1. Cálculo de métricas para el resumen ejecutivo
    const totalRegistros = reportes.length;
    const totalCantidad = reportes.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);

    // 2. Construcción de la tabla de datos
    const tableBody: any[] = [];

    // Encabezados con fondo oscuro e íconos/texto formal
    tableBody.push([
      { text: '#', style: 'tableHeader', alignment: 'center' },
      { text: 'FECHA', style: 'tableHeader' },
      { text: 'PRODUCTO', style: 'tableHeader' },
      { text: 'TIPO MOV.', style: 'tableHeader' },
      { text: 'ORIGEN / DESTINO', style: 'tableHeader' },
      { text: 'CANT.', style: 'tableHeader', alignment: 'right' },
      { text: 'STK. ANT.', style: 'tableHeader', alignment: 'right' },
      { text: 'STK. NUEVO', style: 'tableHeader', alignment: 'right' },
      { text: 'OBSERVACIÓN', style: 'tableHeader' }
    ]);

    // Filas de datos
    reportes.forEach((r, index) => {
      tableBody.push([
        { text: (index + 1).toString(), style: 'tableCellMuted', alignment: 'center' },
        { text: r.fecha || '-', style: 'tableCell' },
        { text: r.producto || '-', style: 'tableCellBold' },
        { text: r.tipoMov || '-', style: 'tableCell' },
        { text: r.origen || '-', style: 'tableCell' },
        { text: r.cantidad ?? 0, style: 'tableCell', alignment: 'right' },
        { text: r.stockAnterior ?? 0, style: 'tableCellMuted', alignment: 'right' },
        { text: r.stockNuevo ?? 0, style: 'tableCellBold', alignment: 'right' },
        { text: r.observacion || '-', style: 'tableCellMuted' }
      ]);
    });

    // 3. Estructura del Documento
    const documentDefinition: any = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [35, 35, 35, 45],

      info: {
        title: 'Informe Ejecutivo de Kardex',
        author: 'FURTHER S.A.'
      },

      content: [
        // BANNER SUPERIOR DE ENCABEZADO
        {
          table: {
            widths: ['*'],
            body: [[
              {
                fillColor: '#1E293B', // Slate 800
                padding: [15, 12, 15, 12],
                stack: [
                  {
                    columns: [
                      { text: 'FURTHER S.A.', fontSize: 16, bold: true, color: '#FFFFFF' },
                      { text: 'INFORME TÉCNICO DE KARDEX', fontSize: 12, bold: true, color: '#38BDF8', alignment: 'right' }
                    ]
                  },
                  {
                    columns: [
                      { text: 'Gestión de Control de Inventarios y Almacén', fontSize: 8, color: '#94A3B8', margin: [0, 2, 0, 0] },
                      { text: `Emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, fontSize: 8, color: '#94A3B8', alignment: 'right', margin: [0, 2, 0, 0] }
                    ]
                  }
                ]
              }
            ]]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 15]
        },

        // SECCIÓN 1: TARJETAS DE RESUMEN EJECUTIVO
        { text: '1. RESUMEN EJECUTIVO', style: 'sectionHeader' },
        {
          columns: [
            {
              width: '33%',
              table: {
                widths: ['*'],
                body: [[{
                  fillColor: '#F8FAFC',
                  padding: [10, 8, 10, 8],
                  stack: [
                    { text: 'TOTAL MOVIMIENTOS', fontSize: 8, color: '#64748B', bold: true },
                    { text: totalRegistros.toString(), fontSize: 14, color: '#0F172A', bold: true, margin: [0, 3, 0, 0] }
                  ]
                }]]
              },
              layout: { hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => '#E2E8F0', vLineColor: () => '#E2E8F0' }
            },
            {
              width: '33%',
              table: {
                widths: ['*'],
                body: [[{
                  fillColor: '#F8FAFC',
                  padding: [10, 8, 10, 8],
                  stack: [
                    { text: 'UNIDADES PROCESADAS', fontSize: 8, color: '#64748B', bold: true },
                    { text: totalCantidad.toString(), fontSize: 14, color: '#0284C7', bold: true, margin: [0, 3, 0, 0] }
                  ]
                }]]
              },
              layout: { hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => '#E2E8F0', vLineColor: () => '#E2E8F0' }
            },
            {
              width: '34%',
              table: {
                widths: ['*'],
                body: [[{
                  fillColor: '#F8FAFC',
                  padding: [10, 8, 10, 8],
                  stack: [
                    { text: 'ESTADO DEL INVENTARIO', fontSize: 8, color: '#64748B', bold: true },
                    { text: 'AUDITADO / VALIDADO', fontSize: 10, color: '#16A34A', bold: true, margin: [0, 5, 0, 0] }
                  ]
                }]]
              },
              layout: { hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => '#E2E8F0', vLineColor: () => '#E2E8F0' }
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 15]
        },

        // SECCIÓN 2: TABLA DE DETALLES DE AUDITORÍA
        { text: '2. DETALLE DE REGISTROS DE KARDEX', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: [20, 70, '*', 65, 75, 45, 50, 55, 110],
            body: tableBody
          },
          layout: {
            hLineWidth: (i: number, node: any) => (i === 0 || i === 1) ? 1.5 : 0.5,
            vLineWidth: () => 0,
            hLineColor: (i: number) => i === 1 ? '#0F172A' : '#E2E8F0',
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#334155'; // Header gris oscuro ejecutivo
              return rowIndex % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
            },
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 5,
            paddingBottom: () => 5
          },
          margin: [0, 0, 0, 25]
        },

        // SECCIÓN 3: FIRMAS / VALIDEZ DEL INFORME (Se ubica al final)
        {
          unbreakable: true,
          stack: [
            { text: '3. RESPONSABLES DE REVISIÓN', style: 'sectionHeader', margin: [0, 0, 0, 25] },
            {
              columns: [
                {
                  stack: [
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: '#94A3B8' }] },
                    { text: 'Elaborado por: Responsable Almacén', fontSize: 8, color: '#475569', bold: true, margin: [0, 5, 0, 0] },
                    { text: 'Firma y Sello', fontSize: 7, color: '#94A3B8' }
                  ],
                  alignment: 'center'
                },
                {
                  stack: [
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: '#94A3B8' }] },
                    { text: 'Aprobado por: Supervisor de Inventario', fontSize: 8, color: '#475569', bold: true, margin: [0, 5, 0, 0] },
                    { text: 'Firma y Sello', fontSize: 7, color: '#94A3B8' }
                  ],
                  alignment: 'center'
                }
              ]
            }
          ]
        }
      ],

      // PIE DE PÁGINA INFORME
      footer: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            { text: 'Informe Confidencial - Uso Interno Exclusivo', fontSize: 7, color: '#94A3B8', margin: [35, 10, 0, 0] },
            { text: `Página ${currentPage} de ${pageCount}`, fontSize: 7, color: '#94A3B8', alignment: 'right', margin: [0, 10, 35, 0] }
          ]
        };
      },

      // ESTILOS CENTRALIZADOS
      styles: {
        sectionHeader: {
          fontSize: 10,
          bold: true,
          color: '#0F172A',
          margin: [0, 0, 0, 8]
        },
        tableHeader: {
          fontSize: 8,
          bold: true,
          color: '#FFFFFF'
        },
        tableCell: {
          fontSize: 8,
          color: '#1E293B'
        },
        tableCellBold: {
          fontSize: 8,
          bold: true,
          color: '#0F172A'
        },
        tableCellMuted: {
          fontSize: 8,
          color: '#64748B'
        }
      }
    };

    pdfMake.createPdf(documentDefinition).download(`Informe_Kardex_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}