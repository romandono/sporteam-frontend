import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Estadistica } from '../models/estadistica.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

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

  getEstadistica(id: string) {
    return this.http.get<Estadistica>(`${base_url}/estadistica/${id}`, this.headers)
    .pipe(
      map( (resp: any) => {
        const {
          _id, id, partidosJugados, goles, asistencias, tarjetasAmarillas, tarjetasRojas, temporada} = resp.estadistica;
        let estadistica = new Estadistica(_id || id, partidosJugados, goles, asistencias, tarjetasAmarillas,tarjetasRojas,temporada);
        return estadistica;
      })
    );
  }
}
