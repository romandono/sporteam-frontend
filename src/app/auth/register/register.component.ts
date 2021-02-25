import { Jugador } from './../../models/usuarios/jugador.model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Zona } from '../../models/zona.model';
import { ZonaService } from '../../services/zona.service';
import { JugadorService } from '../../services/jugador.service';
import { EntrenadorService } from '../../services/entrenador.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;
  public zonas: Zona[] = [];

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    role: ['', Validators.required],
    zona: ['', Validators.required]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private router: Router, 
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private jugadorService: JugadorService,
              private entrenadorService: EntrenadorService,
              private zonaService: ZonaService) {

                this.zonaService.getZonas()
                    .subscribe( ({zonas}) => {
                      this.zonas = zonas;
                    })

               }

  toLogin() {
    this.router.navigateByUrl('/login');
  }

  crearUsuario() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    } 

    let role = this.registerForm.get('role')!.value;
    console.log(this.registerForm.value);
    switch(role) {
      case 'JUGADOR_ROLE': 
        this.jugadorService.crearJugador(this.registerForm.value)
          .subscribe( resp => {
            this.respuestaExitoCreacion(resp.jugador);
          }, (err) => {
            this.respuestaErrorCreacion(err);
          });
      break;
      case 'ENTRENADOR_ROLE':
        this.entrenadorService.crearEntrenador(this.registerForm.value)
        .subscribe( resp => {
          this.respuestaExitoCreacion(resp.entrenador);
        }, (err) => {
          this.respuestaErrorCreacion(err);
        });
      break;
      case 'USER_ROLE':
        this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe( resp => {
          this.respuestaExitoCreacion(resp.usuario);
        }, (err) => {
          this.respuestaErrorCreacion(err);
        });
      break;
    }
    
  }

  campoNoValido(campo: string):boolean {

    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  
  passwordNoValidas() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control!.value === pass2Control!.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({noEsIgual: true});
      }

    }

  }

  private respuestaExitoCreacion(usuario: any) {
    this.router.navigateByUrl('login');
    Swal.fire('¡Muy bien!', `El usuario ${usuario.email} ha sido dado de alta en la aplicación`, 'success');
  }

  private respuestaErrorCreacion(err: any) {
    Swal.fire('Error', err.error.err.message, 'error');
  }

  compareWith(option1: any, option2: any): boolean {
    return option1 && option2 && option1._id === option2._id;
   }

}
