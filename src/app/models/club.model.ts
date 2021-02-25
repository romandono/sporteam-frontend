import { Zona } from './zona.model';
import { Provincia } from './provincia.model';
import { Usuario } from './usuarios/usuario.model';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

export class Club {

    constructor(

        public _id: string,
        public nombre: string,
        public localidad: string,
        public provincia: Provincia,
        public modalidad: string,
        public image: string,
        public zona: Zona,
        public users?: Usuario[]

    ) {}

    get imageUrl() {

        if(!this.image) {
            return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
        } else if (this.image?.includes('https') || this.image?.includes('http')) {
            return this.image;
        } else if (this.image) {
            return `${base_url}/uploads/clubs/${this.image}`;
        } else {
            return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
        }
    }
}