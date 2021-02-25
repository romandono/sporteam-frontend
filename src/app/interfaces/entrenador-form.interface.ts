import { Zona } from './../models/zona.model';
import { Club } from '../models/club.model';

export interface EntrenadorForm {
    nombre: string,
    apellidos: string,
    email: string,
    role?: string,
    estadoDeportivo?: string,
    zona?: Zona,
    usertype?: string,
    club?: Club,
    nombreDeportivo?: string,
    entrenadorPorteros?: boolean,
    titulacion?: [string],
    telefono?: number
}