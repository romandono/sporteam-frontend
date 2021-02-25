import { Zona } from './../zona.model';
import { Usuario } from './usuario.model';
import { Club } from '../club.model';
import { environment } from '../../../environments/environment.prod';

const base_url = environment.base_url;

export class Jugador extends Usuario{

    constructor(
        nombre: string,
        apellidos: string,
        email: string,
        image?: string,
        google?: string,
        role?: string,
        _id?: string,
        password?: string,
        estado?: boolean,
        estadoDeportivo?: string,
        zona?: Zona[],
        usertype?: string,
        club?: Club,
        public nombreDeportivo?: string,
        public fechaNacimiento?: string,
        public lateralidad?: string,
        public demarcacion?: string,
        public altura?: number,
        public peso?: number,
        public estadistica?: [string]
    ) {
        super(nombre, apellidos, email, image, google, role, _id, password, estado, estadoDeportivo, zona, usertype, club);
    }
}