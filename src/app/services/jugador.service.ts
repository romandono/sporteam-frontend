import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Jugador } from '../models/usuarios/jugador.model';
import { pipe, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { JugadorForm } from '../interfaces/jugador-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class JugadorService {

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
  
  crearJugador(formData: RegisterForm) {
    return this.http.post<Jugador>(`${base_url}/jugador`, formData);
  }

  cargarJugador(id: string) {
    return this.http.get<Jugador>(`${base_url}/jugador/${id}`, this.headers)
            .pipe(
              map( (resp: any) => {
                const {
                  nombre, apellidos, email, image, google, role, _id, id, password, estado, estadoDeportivo, zona, usertype, club,
                   nombreDeportivo, fechaNacimiento, lateralidad, demarcacion, altura, peso, estadisticas} = resp.jugador;
                let jugador = new Jugador(nombre, apellidos, email, image, google, role, _id || id, password, estado, estadoDeportivo, zona, usertype, club,
                  nombreDeportivo, fechaNacimiento, lateralidad, demarcacion, altura, peso, estadisticas);
                return jugador;
              })
            );
  }

  actualizarJugador(id: string, data: JugadorForm) {
    if (!id) {
      console.error('actualizarJugador: ID vacío');
      return throwError(() => new Error('ID de jugador no proporcionado'));
    }
    console.log('PUT /jugador/' + id, data);
    return this.http.put(`${base_url}/jugador/${id}`, data, {
      headers: {
        'token': this.token
      }
    });
  }

  eliminarJugador(jugador: Jugador) {
    const url = `${base_url}/usuario/${jugador.id}`;
    return this.http.delete(url, this.headers);
  }
}
