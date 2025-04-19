import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'precio',
    'categoria',
    'stock',
    'fechaCreacion',
    'actions',
  ];

  constructor(
    private productsService: ProductService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  dataSource: Product[] = [];
  @ViewChild(MatTable) table!: MatTable<Product>;

  getProducts(): void {
    this.productsService.getProducts().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // ← Añade esto
        this.dataSource = data;
      },
      (error) => console.error('Error al obtener empleados:', error)
    );
  }

  deleteProducts(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    Swal.fire({
      title: '¿Eliminar producto?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProducts(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado.',
            'success'
          ).then(() => {
            this.dataSource = this.dataSource.filter(
              (product) => product.productoId !== id
            );
            this.table.renderRows();
          });
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormCreateComponent, {
      width: '600px',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((products: Product) => {
      if (products) {
        this.dataSource = [...this.dataSource, products];
      }
    });
  }

  openEditDialog(product: Product, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '600px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((product: Product) => {
      if (product) {
        const index = this.dataSource.findIndex(
          (p) => p.productoId === product.productoId
        );
        if (index !== -1) {
          this.dataSource[index] = product;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
