import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  loading = true;

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

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalProductos = data.productos?.length || 0;
        this.totalClientes = data.clientes?.length || 0;
        this.totalVentas = data.ventas?.length || 0;
        this.totalUsuarios = data.usuarios?.length || 0;

        this.montoVentas = this.calcularMontoVentas(data.ventas || []);

        this.actividades = [
          {
            icon: 'shopping_cart',
            titulo: 'Productos registrados',
            descripcion: `${this.totalProductos} productos en el sistema`,
            estado: 'Activo'
          },
          {
            icon: 'groups',
            titulo: 'Clientes registrados',
            descripcion: `${this.totalClientes} clientes en el sistema`,
            estado: 'Activo'
          },
          {
            icon: 'attach_money',
            titulo: 'Ventas realizadas',
            descripcion: `${this.totalVentas} ventas registradas`,
            estado: 'Activo'
          },
          {
            icon: 'manage_accounts',
            titulo: 'Usuarios registrados',
            descripcion: `${this.totalUsuarios} usuarios en el sistema`,
            estado: 'Activo'
          }
        ];

        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando dashboard:', error);
        this.loading = false;
      }
    });
  }

  calcularMontoVentas(ventas: any[]): number {
    return ventas.reduce((total, venta) => {
      return total + Number(
        venta.total ||
        venta.monto ||
        venta.totalVenta ||
        venta.precioTotal ||
        0
      );
    }, 0);
  }
}