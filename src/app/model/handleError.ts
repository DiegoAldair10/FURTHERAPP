import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleError(error: HttpErrorResponse) {

    console.error('Error API:', error);

    if (error.status === 400) {

      return throwError(() =>
        new Error(
          error.error?.message ||
          'Datos inválidos. Verifique la información ingresada.'
        )
      );
    }

    if (error.status === 401) {

      return throwError(() =>
        new Error(
          'Sesión expirada. Inicie sesión nuevamente.'
        )
      );
    }

    if (error.status === 403) {

      return throwError(() =>
        new Error(
          'No tiene permisos para realizar esta acción.'
        )
      );
    }

    if (error.status === 404) {

      return throwError(() =>
        new Error(
          error.error?.message ||
          'Registro no encontrado.'
        )
      );
    }

    if (error.status === 500) {

      return throwError(() =>
        new Error(
          'Error interno del servidor.'
        )
      );
    }

    return throwError(() =>
      new Error(
        'Ocurrió un error inesperado.'
      )
    );
  }