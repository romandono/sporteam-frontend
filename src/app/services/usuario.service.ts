import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuarios/usuario.model';
import { ListadoJugadores } from '../interfaces/listado-jugadores.interface';
import { Jugador } from '../models/usuarios/jugador.model';
import { ListadoUsuarios } from '../interfaces/listado-usuarios.interface';
import { Entrenador } from '../models/usuarios/entrenador.model';
import Swal from 'sweetalert2';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): string {
    return this.usuario.role || '';
  }

  get authGoogle(): string {
    return this.usuario.google || '';
  }

  get id(): string{
    return this.usuario.id || '';
  }

  get headers() {
    return {
      headers: {
        'token': this.token
      }
    } 
  }

  googleInit() {

    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '1065470350283-opnoc4ls4vkr45b0u2g42i4f6j6mutdb.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        resolve();
      });
    });

  }

  logout() {
    localStorage.removeItem('token');
    if (this.authGoogle) {
      this.auth2.signOut().then(() => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      });
    } else {
      this.router.navigateByUrl('/login');
    }
    Swal.fire('','Has cerrado sesión correctamente', 'info');
  }

  validarToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';

   return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'token': token
      }
    }).pipe(
      map( (resp: any) => {
        const {
          email, google, nombre, apellidos, role, image = '', _id, id, estado, estadoDeportivo, zona, usertype, club
        } = resp.usuario || {};
        this.usuario = new Usuario(nombre, apellidos, email, image, google, role, _id || id, '', estado, estadoDeportivo, zona, usertype, club);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError( error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm) {
    return this.http.post<Usuario>(`${base_url}/usuario`, formData);
  }

  actualizarUsuario( data: {apellidos:string, nombre: string, zona: string, estadoDeportivo: string, role: string, club: string}) {
    console.log(data);
    return this.http.put(`${base_url}/usuario/${this.id}`, data, {
      headers: {
        'token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  loginGoogle(token: any) {
    return this.http.post(`${base_url}/google`, {token})
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  getUsuarios(limite: number) {

    const url = `${base_url}/usuarios?limite=${limite}`;

    return this.http.get<ListadoUsuarios>(url ,this.headers)
                .pipe(
                  map( resp => {
                    const usuarios = resp.usuarios.map( 
                      usuario => new Usuario(usuario.nombre,usuario.apellidos,usuario.email,usuario.image,usuario.google,
                        usuario.role,usuario.id,'',usuario.estado,usuario.estadoDeportivo,usuario.zona,usuario.usertype, usuario.club)
                      );

                    return {
                      total: resp.total,
                      usuarios
                    };
                  })
                )

  }

  getJugadores(desde: number = 0) {

    const url = `${base_url}/jugadores?desde=${desde}`;

    return this.http.get<ListadoJugadores>(url ,this.headers)
                .pipe(
                  map( resp => {
                    const jugadores = resp.jugadores.map( 
                      jugador => new Jugador(jugador.nombre,jugador.apellidos,jugador.email,jugador.image,jugador.google,
                        jugador.role,jugador.id,'',jugador.estado,jugador.estadoDeportivo,jugador.zona, jugador.usertype, jugador.club,jugador.nombreDeportivo,
                        jugador.fechaNacimiento,jugador.lateralidad,jugador.demarcacion,jugador.altura,jugador.peso)
                      );

                    return {
                      total: resp.total,
                      jugadores
                    };
                  })
                )

  }
}
