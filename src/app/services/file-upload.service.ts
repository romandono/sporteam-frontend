import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: string,
    id: string
  ) {

    try {
      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('archivo', archivo);
      console.log(url);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      console.log(data);

      if (data.ok) {
        return data.image;
      } else {
        return false;
      }

    } catch(err) {
      return false;
    }

  }
}
