import { Zona } from './../models/zona.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ListadoZonas } from '../interfaces/listado-zonas.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  constructor(private http: HttpClient) { }

  getZonas() {
    return this.http.get<ListadoZonas>(`${base_url}/zonas`)
                    .pipe(
                      map( resp => {
                        const zonas = resp.zonas.map(
                          zona => new Zona(zona.nombreZona, zona._id || zona.id)
                        );
                        return {
                          zonas
                        }
                      })
                    );
  }
}
