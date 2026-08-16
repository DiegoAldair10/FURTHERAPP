import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { BuysService } from '../../services/buys.service';
import { SupplierService } from '../../services/supplier.service'; // Ajusta la ruta a tu servicio de proveedores

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css',
})
export class FormCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private buysService = inject(BuysService);
  private supplierService = inject(SupplierService);
  private productoService = inject(ProductService);

  proveedores: any[] = [];
  products: Product[] = [];
  buysForm: FormGroup;

  comprobantes = [
    { id: 1, nombre: 'FACTURA' },
    { id: 2, nombre: 'BOLETA' },
  ];

  constructor(public dialogRef: MatDialogRef<FormCreateComponent>) {
    this.buysForm = this.fb.group({
      proveedor: [null, Validators.required],
      tipoComprobante: [null, Validators.required],
      serie: ['', Validators.required],
      numero: ['', Validators.required],
      moneda: ['PEN', Validators.required],
      detalles: this.fb.array([]),
    });
  }

 ngOnInit(): void {
  this.cargarDatos();
  this.agregarDetalle();

  this.buysForm.get('tipoComprobante')?.valueChanges.subscribe((tipo: string) => {
    if (tipo) {
      this.buysService.getNextComprobante(tipo).subscribe({
        next: (comprobante: string) => {
          console.log('Comprobante recibido:', comprobante); // 👈 Revisa qué devuelve tu backend

          if (comprobante && comprobante.includes('-')) {
            const [serie, numero] = comprobante.split('-');
            this.buysForm.patchValue({ serie, numero });
          } else if (comprobante) {
            // Si el backend solo manda la serie o el número por separado, ajusta según corresponda
            const prefijoSerie = tipo === 'FACTURA' ? 'F001' : 'B001';
            this.buysForm.patchValue({ 
              serie: prefijoSerie, 
              numero: comprobante 
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener correlativo de compra:', err);
          
          // Fallback por defecto si la API falla
          const serieDefault = tipo === 'FACTURA' ? 'F001' : 'B001';
          this.buysForm.patchValue({ 
            serie: serieDefault, 
            numero: '000001' 
          });
        },
      });
    } else {
      this.buysForm.patchValue({ serie: '', numero: '' });
    }
  });
}

  get detalles(): FormArray {
    return this.buysForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
    });

    // Autocompletar costo o precio si el producto lo requiere
    detalleGroup.get('producto')?.valueChanges.subscribe((producto: any) => {
      if (producto && producto.costo_promedio != null) {
        detalleGroup.get('precioUnitario')?.setValue(producto.costo_promedio);
      }
    });

    this.detalles.push(detalleGroup);
  }

  eliminarDetalle(index: number): void {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

cargarDatos(): void {
  this.supplierService
    .getSupplier() 
    .subscribe((data) => (this.proveedores = data));

  this.productoService
    .getProducts()
    .subscribe((data) => (this.products = data));
}

  onSubmit(): void {
    if (this.buysForm.invalid) {
      this.buysForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos requeridos.',
      });
      return;
    }

    const formValue = this.buysForm.value;

    // Construcción exacta del JSON para la creación de compra
    const compraPayload = {
      proveedorId:
        typeof formValue.proveedor === 'object'
          ? formValue.proveedor.proveedorId
          : formValue.proveedor,
      tipoComprobante: formValue.tipoComprobante,
      serie: formValue.serie,
      numero: formValue.numero,
      moneda: formValue.moneda,
      detalles: formValue.detalles.map((d: any) => ({
        productoId: d.producto.productoId,
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
      })),
    };

    this.buysService.createPurchase(compraPayload as any).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Compra Registrada',
          text: 'La compra se guardó correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.dialogRef.close(response);
        });
      },
      error: (err) => {
        console.error('Error al registrar compra:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la compra.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
