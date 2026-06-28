import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DashboardService } from '../services/dashboard.service';
import { Dashboard } from '../model/dashboard';import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
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
    NgApexchartsModule,
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public chartOptions!: Partial<ChartOptions>;

  nombreUsuario = 'Administrador';
  loading = true;

  dashboard!: Dashboard;

  totalProductos = 0;
  totalClientes = 0;
  totalVentas = 0;
  totalUsuarios = 0;
  montoVentas = 0;

  actividades: any[] = [];

  constructor(private dashboardService: DashboardService) {}

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
            titulo: 'Ventas',
            descripcion: `${this.totalVentas} ventas realizadas`,
            estado: 'Activo',
          },

          {
            icon: 'manage_accounts',
            titulo: 'Usuarios',
            descripcion: `${this.totalUsuarios} usuarios registrados`,
            estado: 'Activo',
          },
        ];

        this.loading = false;
      },

      error: (error: any) => {
        console.error('Error cargando dashboard', error);

        this.loading = false;
      },
    });
  }
}
