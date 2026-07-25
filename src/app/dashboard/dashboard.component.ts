import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DashboardService } from '../services/dashboard.service';
import { Dashboard } from '../model/dashboard';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
  ApexFill,
  ApexMarkers,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;

  chart: ApexChart;

  xaxis: ApexXAxis;

  stroke: ApexStroke;

  dataLabels: ApexDataLabels;

  grid: ApexGrid;

  tooltip: ApexTooltip;

  colors: string[];

  fill: ApexFill;

  markers: ApexMarkers;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;

  nombreUsuario = 'Administrador';

  loading = true;

  dashboard!: Dashboard;

  totalProductos = 0;

  totalClientes = 0;

  totalVentas = 0;

  totalUsuarios = 0;

  montoVentas = 0;

  actividades: any[] = [];

  constructor(private dashboardService: DashboardService) {
    this.chartOptions = {
      series: [
        {
          name: 'Ventas',
          data: [1500, 2800, 1900, 3200, 4100, 3600, 5000],
        },
      ],

      chart: {
        type: 'area',
        height: 340,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },

      colors: ['#1464F4'],

      stroke: {
        curve: 'smooth',
        width: 4,
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },

      markers: {
        size: 5,
      },

      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      },

      grid: {
        borderColor: '#ECEFF5',
      },

      tooltip: {
        enabled: true,
      },
    };
  }

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
      next: (data: Dashboard) => {
        this.dashboard = data;

        this.totalProductos = data.totalProductos;

        this.totalClientes = data.totalClientes;

        this.totalVentas = data.totalVentas;

        this.totalUsuarios = data.totalUsuarios;

        this.montoVentas = data.montoVentas;

        this.actividades = [
          {
            icon: 'inventory_2',
            titulo: 'Productos',
            descripcion: `${this.totalProductos} productos registrados`,
            estado: 'Activo',
          },

          {
            icon: 'groups',
            titulo: 'Clientes',
            descripcion: `${this.totalClientes} clientes registrados`,
            estado: 'Activo',
          },

          {
            icon: 'point_of_sale',
            titulo: `${this.totalVentas} Ventas`,
            descripcion: `Monto vendido S/ ${this.montoVentas}`,
            estado: 'Activo',
          },

          {
            icon: 'manage_accounts',
            titulo: 'Usuarios',
            descripcion: `${this.totalUsuarios} usuarios registrados`,
            estado: 'Activo',
          },
        ];

        // NUEVO
        this.cargarGrafico();
        this.loading = false;
      },

      error: (err) => {
        console.error(err);

        this.loading = false;
      },
    });
  }

  private cargarGrafico(): void {
    this.dashboardService.getVentasMes().subscribe({
      next: (ventas) => {
        this.chartOptions = {
          ...this.chartOptions,
          series: [
            {
              name: 'Ventas',
              data: ventas.map(v => v.total),
            },
          ],
          xaxis: {
            categories: ventas.map(v => v.mes),
          },
        };
      },
      error: (err) => {
        console.error('Error cargando gráfico', err);
      },
    });
  }
}
