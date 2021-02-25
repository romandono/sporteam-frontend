import { Zona } from './../zona.model';
import { Usuario } from './usuario.model';
import { Club } from '../club.model';

export class Entrenador extends Usuario {

    constructor(
        nombre: string,
        apellidos: string,
        email: string,
        image?: string,
        google?: string,
        role?: string,
        id?: string,
        password?: string,
        estado?: boolean,
        estadoDeportivo?: string,
        zona?: Zona[],
        usertype?: string,
        club?: Club,
        public nombreDeportivo?: string,
        public entrenadorPorteros?: boolean,
        public titulacion?: [string],
        public telefono?: number
    ) {
        super(nombre, apellidos, email, image, google, role, id, password, estado, estadoDeportivo, zona, usertype, club);
    }
}