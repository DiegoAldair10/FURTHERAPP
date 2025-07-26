import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProductsComponent } from './products/products.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SalesComponent } from './sales/sales.component';

export const routes: Routes = [
  { path: 'clientes', component: CustomerComponent },
  { path: 'empleados', component: EmployeeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'proveedores', component: SupplierComponent },
  { path: 'ventas', component: SalesComponent },
];
