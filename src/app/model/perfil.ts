export interface Perfil {
  usuarioId: number;
  empleadoId?: number;
  nombre?: string;
  apellido?: string;
  email: string;
  telefono?: string;
  cargo?: string;
  estado: number;
  roles: string[];
}