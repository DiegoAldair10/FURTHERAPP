import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Category } from '../model/category';
import { CategoryService } from '../services/category.service';
import Swal from 'sweetalert2';
import { FormcategoryCreateComponent } from './form-category-create/form-category-create.component';
import { FormCategoryUpdateComponent } from './form-category-update/form-category-update.component';

@Component({
  selector: 'app-category',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];

  dataSource: Category[] = [];

  @ViewChild(MatTable) table!: MatTable<Category>;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        console.log('Datos recibidos:', data);
        this.dataSource = data;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  deleteCategory(id: number, event: Event): void {
    (event.currentTarget as HTMLElement).blur();

    Swal.fire({
      title: '¿Eliminar la categoría?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'La categoría ha sido eliminada.',
            'success'
          ).then(() => {
            // Actualizar la tabla o recargar los datos
            this.dataSource = this.dataSource.filter(
              (category) => category.categoriaId !== id
            );
            this.table.renderRows();
          });
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormcategoryCreateComponent, {
      width: '700px', // ancho fijo pero responsive
      maxWidth: '90vw', // limite responsive
      maxHeight: '90vh', // límite de altura de la pantalla
      panelClass: 'custom-dialog', // para aplicar estilos CSS específicos
    });

    dialogRef.afterClosed().subscribe((category: Category) => {
      if (category) {
        this.dataSource = [...this.dataSource, category];
      }
    });
  }

  openEditDialog(category: Category, event: Event): void {
    (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado

    const dialogRef = this.dialog.open(FormCategoryUpdateComponent, {
      width: '600px',
      data: { category },
    });

    dialogRef.afterClosed().subscribe((category: Category) => {
      if (category) {
        const index = this.dataSource.findIndex(
          (e) => e.categoriaId === category.categoriaId
        );
        if (index !== -1) {
          this.dataSource[index] = category;
          this.dataSource = [...this.dataSource];
          this.table.renderRows();
        }
      }
    });
  }
}
