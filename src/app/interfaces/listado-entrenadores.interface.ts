import { Entrenador } from './../models/usuarios/entrenador.model';
export interface ListadoEntrenadores {
    total: number;
    entrenadores: Entrenador[];
}