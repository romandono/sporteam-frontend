import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private usuarioService: UsuarioService,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

     return this.usuarioService.validarToken()
      .pipe(
        tap(estadoAutenticado => {

          if (!estadoAutenticado) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
