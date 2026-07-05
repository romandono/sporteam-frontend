import { Entrenador } from './../models/usuarios/entrenador.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { ListadoEntrenadores } from '../interfaces/listado-entrenadores.interface';
import { map } from 'rxjs/operators';
import { EntrenadorForm } from '../interfaces/entrenador-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  constructor(private http: HttpClient,
              private router: Router) { }


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

  crearEntrenador(formData: RegisterForm) {
    return this.http.post<Entrenador>(`${base_url}/entrenador`, formData);
  }      

  actualizarEntrenador(id: string, data: EntrenadorForm) {
    console.log(data);
    return this.http.put(`${base_url}/entrenador/${id}`, data, {
      headers: {
        'token': this.token
      }
    });
  }
  
  getEntrenadores(desde: number = 0) {

    const url = `${base_url}/entrenadores?desde=${desde}`;

    return this.http.get<ListadoEntrenadores>(url ,this.headers)
                .pipe(
                  map( resp => {
                    const entrenadores = resp.entrenadores.map( 
                      entrenador => new Entrenador(entrenador.nombre,entrenador.apellidos,entrenador.email,entrenador.image,entrenador.google,
                        entrenador.role,entrenador._id || entrenador.id,'',entrenador.estado,entrenador.estadoDeportivo,entrenador.zona, entrenador.usertype, entrenador.club,entrenador.nombreDeportivo,
                        entrenador.entrenadorPorteros,entrenador.titulacion,entrenador.telefono)
                      );

                    return {
                      total: resp.total,
                      entrenadores
                    };
                  })
                )

  }

  cargarEntrenador(id: string) {
    return this.http.get<Entrenador>(`${base_url}/entrenador/${id}`, this.headers)
            .pipe(
              map( (resp: any) => {
                const {
                  nombre, apellidos, email, image, google, role, _id, id, password, estado, estadoDeportivo, zona, usertype, club,
                   nombreDeportivo, entrenadorPorteros, titulacion, telefono} = resp.entrenador;
                let entrenador = new Entrenador(nombre, apellidos, email, image, google, role, _id || id, password, estado, estadoDeportivo, zona, usertype, club,
                  nombreDeportivo, entrenadorPorteros, titulacion, telefono);
                return entrenador;
              })
            );
  }

  eliminarEntrenador(entrenador: Entrenador) {
    const url = `${base_url}/usuario/${entrenador.id}`;
    return this.http.delete(url, this.headers);
  }
  
  
}
