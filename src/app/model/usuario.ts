import { Role } from "./role";

export interface Usuario {
  usuariosId: number;
  email: string;
  password: string;
  estado: number;
  roles: Role[];
}
