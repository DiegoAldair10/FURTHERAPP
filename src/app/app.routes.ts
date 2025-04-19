import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: 'clientes', component: CustomerComponent },
  { path: 'empleados', component: EmployeeComponent },
  { path: 'productos', component: ProductsComponent },
];
