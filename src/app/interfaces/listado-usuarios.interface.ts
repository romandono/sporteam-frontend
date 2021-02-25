import { Usuario } from '../models/usuarios/usuario.model';

export interface ListadoUsuarios {
    total: number;
    usuarios: Usuario[];
}