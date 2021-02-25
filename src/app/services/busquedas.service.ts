import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuarios/usuario.model';
import { Club } from '../models/club.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.apellidos, user.email, user.image, user.google, user.role, user._id, '', user.estado, user.estadoDeportivo, user.zona)
    )
  }

  private transformarClubs(resultados: any[]): Club[] {
    return resultados.map(
      club => new Club(club._id, club.nombre, club.localidad, club.provincia, club.modalidad, club.image, club.zona, club.users)
    )
  }

  buscar(tipo: 'usuarios'|'jugadores'|'entrenadores',
        termino: string) {

    const url = `${base_url}/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
              .pipe(
                map( (resp:any) => {
                  switch (tipo) {
                    case 'jugadores':
                      return this.transformarUsuarios(resp.resultados);
                    case 'entrenadores':
                      return this.transformarUsuarios(resp.resultados);
                    default:
                      return [];
                  }
                })
              );
  }
  buscarClubs(tipo: 'clubs',
        termino: string) {

    const url = `${base_url}/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
              .pipe(
                map( (resp:any) => {
                  return this.transformarClubs(resp.resultados);
                })
              );
  }
}
