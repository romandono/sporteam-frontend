import { Zona } from './../zona.model';
import { environment } from '../../../environments/environment';
import { Club } from '../club.model';

const base_url = environment.base_url;

export class Usuario {
  [x: string]: any;

        public nombre!: string;
        public apellidos!: string;
        public email!: string;
        public image?: string;
        public google?: string;
        public role?: string;
        public id?: string;
        public password?: string;
        public estado?: boolean;
        public estadoDeportivo?: string;
        public zona?: Zona[];
        public usertype?: string;
        public club?: Club;

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
        club?: Club
    ) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.image = image;
        this.google = google;
        this.role = role;
        this.id = id;
        this.password = password;
        this.estado = estado;
        this.estadoDeportivo = estadoDeportivo;
        this.zona = zona;
        this.usertype = usertype;
        this.club = club;
    }

    get imageUrl() {

        if(!this.image) {
            return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
        } else if (this.image?.includes('https') || this.image?.includes('http')) {
            return this.image;
        } else if (this.image) {
            return `${base_url}/uploads/usuarios/${this.image}`;
        } else {
            return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
        }
    }

}