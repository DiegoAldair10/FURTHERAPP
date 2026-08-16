import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { BuysService } from '../services/buys.service';
import { ProductService } from '../services/product.service'; // 👈 Importa tu servicio de productos
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Purchase } from '../model/purchase';
import { MatTable, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormDetailsComponent } from './form-details/form-details.component';
import { FormUpdateComponent } from './form-update/form-update.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs'; // 👈 Importa forkJoin de rxjs

@Component({
  selector: 'app-buys',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './buys.component.html',
  styleUrl: './buys.component.css',
})
export class BuysComponent implements OnInit {

  displayedColumns: string[] = [
    'compraId',
    'proveedor',
    'productos',
    'fechaCompra',
    'totalCompra',
    'estado',
    'estadoPago',
    'detalles',
    'acciones'
  ];

  dataSource: Purchase[] = [];
  @ViewChild(MatTable) table!: MatTable<Purchase>;

  private productService = inject(ProductService); // 👈 Inyecta ProductService

  constructor(
    private buysService: BuysService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getBuys();
  }

  getBuys(): void {
    // forkJoin ejecuta ambos HTTP requests en paralelo
    forkJoin({
      compras: this.buysService.getBuys(),
      productos: this.productService.getProducts()
    }).subscribe({
      next: ({ compras, productos }) => {

        // Mapeamos cada compra enriqueciendo sus detalles con el objeto del producto
        this.dataSource = compras.map((compra) => {
          if (compra.detalles) {
            compra.detalles = compra.detalles.map((detalle: any) => {
              const prod = productos.find(p => p.productoId === detalle.productoId);
              return {
                ...detalle,
                producto: detalle.producto || prod,
                productoNombre: detalle.productoNombre || detalle.producto?.nombre || prod?.nombre
              };
            });
          }
          return compra;
        });

        console.log('Compras procesadas con productos:', this.dataSource);
      },
      error: (error) => {
        console.error('Error al obtener compras o productos:', error);
      }
    });
  }

  deletePurchases(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();
    Swal.fire({
      title: '¿Eliminar compra?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.buysService.deletePurchases(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La compra ha sido eliminada.', 'success');
            this.dataSource = this.dataSource.filter((s) => s.compraId !== id);
            if (this.table) {
              this.table.renderRows();
            }
          },
          error: (err) => {
            console.error('Error al eliminar compra:', err);
            Swal.fire(
              'Error',
              err.message || 'No se pudo eliminar la compra.',
              'error',
            );
          },
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormCreateComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((purchases: Purchase) => {
      if (purchases) {
        this.getBuys();
      }
    });
  }

  openEditDialog(purchase: Purchase, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    const dialogRef = this.dialog.open(FormUpdateComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      data: { compra: purchase },
    });

    dialogRef.afterClosed().subscribe((p: Purchase) => {
      if (p) {
        this.getBuys();
      }
    });
  }

  openDetailsDialog(purchase: Purchase, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    const dialogRef = this.dialog.open(FormDetailsComponent, {
      width: '600px',
      data: { compra: purchase },
    });

    dialogRef.afterClosed().subscribe((p: Purchase) => {
      if (p) {
        const index = this.dataSource.findIndex(
          (e) => e.compraId === p.compraId,
        );
        if (index !== -1) {
          this.dataSource[index] = p;
          this.dataSource = [...this.dataSource];
          if (this.table) {
            this.table.renderRows();
          }
        }
      }
    });
  }
}