import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Pipe({
    name: 'imagen',
    standalone: false
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: 'usuarios'|'clubs'): string {

    if(!imagen) {
      return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
  } else if (imagen?.includes('https') || imagen?.includes('http')) {
      return imagen;
  } else if (imagen) {
      return `${base_url}/uploads/${tipo}/${imagen}`;
  } else {
      return 'https://res.cloudinary.com/sporteam/image/upload/v1607430509/no-image_epobu0.jpg';
  }
  
  }

}
