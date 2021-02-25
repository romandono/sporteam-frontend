import { Zona } from './../models/zona.model';
import { Club } from '../models/club.model';

export interface JugadorForm {
        nombre: string,
        apellidos: string,
        email: string,
        role?: string,
        estadoDeportivo?: string,
        zona?: Zona,
        usertype?: string,
        club?: Club,
        nombreDeportivo?: string,
        fechaNacimiento?: string,
        lateralidad?: string,
        demarcacion?: string,
        altura?: number,
        peso?: number
}