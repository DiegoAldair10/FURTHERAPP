import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProductsComponent } from './products/products.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SalesComponent } from './sales/sales.component';
import { PaymentComponent } from './payment/payment.component';
import { SalesPaymentsComponent } from './sales-payments/sales-payments.component';
import { CategoryComponent } from './category/category.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilDetailsComponent } from './perfil-details/perfil-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: CustomerComponent },
  { path: 'empleados', component: EmployeeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'proveedores', component: SupplierComponent },
  { path: 'ventas', component: SalesComponent },
  { path: 'metodos-pago', component: PaymentComponent },
  { path: 'pago', component: SalesPaymentsComponent },
  { path: 'categoria', component: CategoryComponent },
  { path: 'usuario', component: UserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'perfil', component: PerfilDetailsComponent },
  { path: '**', redirectTo: 'login' },
];
