import { Component, inject, OnInit } from '@angular/core';
import { Kardex } from '../model/kardex';
import { MovimientoMes } from '../model/movimientoMes';
import { ProductoStock } from '../model/productoStock';
import { StockCategoria } from '../model/stockCategoria';
import { InventoryService } from '../services/inventory.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InventoryDashboard } from '../model/InventoryDashboard';

@Component({
  selector: 'app-inventory',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  movimientosChart: any;

  stockChart: any;
  private inventoryService = inject(InventoryService);

  dashboard!: InventoryDashboard;

  movimientos: MovimientoMes[] = [];

  stockCategorias: StockCategoria[] = [];

  productosStock: ProductoStock[] = [];

  ultimosMovimientos: Kardex[] = [];

  ngOnInit(): void {
    this.cargarDashboard();

    this.inventoryService
    .obtenerMovimientosMes()
    .subscribe(data => {

        this.movimientos = data;

        this.movimientosChart = {

            series: [

                {
                    name: 'Entradas',
                    data: data.map(x => x.entradas)
                },

                {
                    name: 'Salidas',
                    data: data.map(x => x.salidas)
                }

            ],

            chart: {
                type: 'line',
                height: 320,
                toolbar: {
                    show: false
                }
            },

            stroke: {
                curve: 'smooth',
                width: 4
            },

            xaxis: {
                categories: data.map(x => x.mes)
            },

            dataLabels: {
                enabled: false
            },

            legend: {
                position: 'top'
            }

        };

    });

    this.inventoryService
    .obtenerStockCategoria()
    .subscribe(data => {

        this.stockCategorias = data;

        this.stockChart = {

            series: data.map(x => x.stock),

            chart: {
                type: 'donut',
                height: 320
            },

            labels: data.map(x => x.categoria),

            legend: {
                position: 'bottom'
            }

        };

    });
  }

  cargarDashboard(): void {
    this.inventoryService
      .obtenerDashboard()
      .subscribe((data) => (this.dashboard = data));

    this.inventoryService
      .obtenerMovimientosMes()
      .subscribe((data) => (this.movimientos = data));

    this.inventoryService
      .obtenerStockCategoria()
      .subscribe((data) => (this.stockCategorias = data));

    this.inventoryService
      .obtenerProductosStockBajo()
      .subscribe((data) => (this.productosStock = data));

    this.inventoryService
      .obtenerUltimosMovimientos()
      .subscribe((data) => (this.ultimosMovimientos = data));
  }
}
