import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../model/usuario';
import Swal from 'sweetalert2';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Employe } from '../model/employe';
import { FormCreateComponent } from './form-create/form-create.component';
import { FormUpdateComponent } from './form-update/form-update.component';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'roles',  'estado', 'actions'];
  dataSource: Usuario[] = [];
  @ViewChild(MatTable) table!: MatTable<Usuario>;
element: any;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public dialogUpdate: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser().subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // ← Añade esto
        this.dataSource = data;
      },
      (error) => console.error('Error al obtener usuarios:', error),
    );
  }

  getRoles(roles: any[]): string {
  if (!roles || roles.length === 0) {
    return 'Sin roles';
  }

  return roles
    .map(role => role.nombre)
    .join(', ');
}

getEstado(estado: number): string {

  switch (estado) {
    case 1:
      return 'Activo';

    case 0:
      return 'Inactivo';

    default:
      return 'Desconocido';
  }
}

 deleteUser(id: number, event: Event): void {
  (event.currentTarget as HTMLElement).blur();

  Swal.fire({
    title: '¿Eliminar usuario?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
            'success'
          ).then(() => {
            this.getUser();
          });
        },
        error: (error) => {
          Swal.fire(
            'Error',
            error.message || 'No se pudo eliminar el usuario',
            'error'
          );
        },
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

    dialogRef.afterClosed().subscribe((user: Usuario) => {
      if (user) {
        this.dataSource = [...this.dataSource, user];
      }
    });
  }

   openEditDialog(user: Usuario, event: Event): void {
      (event.currentTarget as HTMLElement).blur(); // ✅ esto quitará el sombreado
  
      const dialogRef = this.dialog.open(FormUpdateComponent, {
        width: '600px',
        data: { user },
      });
  
      dialogRef.afterClosed().subscribe((updatedUser: Usuario) => {
        if (updatedUser) {
          const index = this.dataSource.findIndex(
            (u) => u.usuariosId === updatedUser.usuariosId
          );
          if (index !== -1) {
            this.dataSource[index] = updatedUser;
            this.dataSource = [...this.dataSource];
            this.table.renderRows();
          }
        }
      });
    }
}
