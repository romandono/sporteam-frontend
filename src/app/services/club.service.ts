import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Club } from '../models/club.model';
import { ListadoClubs } from '../interfaces/listado-clubs.interface';
import { map } from 'rxjs/operators';
import { Provincia } from '../models/provincia.model';
import { ListadoProvincias } from '../interfaces/listado-provincias.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'token': this.token
      }
    } 
  }

  crearClub(formData: any) {
    return this.http.post<any>(`${base_url}/club`, formData);
  }

  getProvincias() {
    const url = `${base_url}/provincias`;
    return this.http.get<ListadoProvincias>(url, this.headers)
            .pipe(
              map( resp => {
                const provincias = resp.provincias.map(
                  provincia => new Provincia(provincia._id, provincia.nombre)
                );
                return {
                  provincias
                }
              })
            );
  }

  getClubs(desde: number = 0) {

    const url = `${base_url}/clubs?desde=${desde}`;

    return this.http.get<ListadoClubs>(url ,this.headers)
                .pipe(
                  map( resp => {
                    const clubs = resp.clubs.map( 
                      club => new Club(club._id,club.nombre,club.localidad,club.provincia,club.modalidad,club.image,
                        club.zona,club.users)
                      );

                    return {
                      total: resp.total,
                      clubs
                    };
                  })
                )

  }

  eliminarClub(club: Club) {
    const url = `${base_url}/club/${club._id}`;
    return this.http.delete(url, this.headers);
  }
}
