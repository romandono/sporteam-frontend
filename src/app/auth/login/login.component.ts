import { Component, NgZone, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { LoginForm } from '../../interfaces/login-form.interface';
import Swal from 'sweetalert2';

declare function customInitFunctions(): any;
declare const gapi: any;

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [localStorage.getItem('remember') || false]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
    customInitFunctions();
  }

  campoNoValido(campo: string):boolean {

    if (this.loginForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  login() {

    this.formSubmitted = true;

    if(this.loginForm.invalid) {
      return;
    }

    this.usuarioService.login(this.loginForm.getRawValue() as LoginForm)
        .subscribe(resp => {
          
          const email = this.loginForm.get('email')!.value ?? '';
          const remember = this.loginForm.get('remember')!.value ?? false;
          if(remember) {
            localStorage.setItem('email', email as string);
            localStorage.setItem('remember', String(remember));
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('remember');
          }

          this.router.navigateByUrl('/');

        }, (error) => {
          console.log(error);
          Swal.fire('Error', 'Credenciales inválidas', 'error');
        });

  }

  register() {
    this.router.navigateByUrl('/register');
  }
  
  renderButton() {
    this.startApp();
  }

  async startApp() {
    
      await this.usuarioService.googleInit();
      this.auth2 = this.usuarioService.auth2;
      this.attachSignin(document.getElementById('customBtn'));

  };

  attachSignin(element: any) {
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) => {
          const id_token = googleUser.getAuthResponse().id_token;
          
          this.usuarioService.loginGoogle(id_token)
            .subscribe(resp => {
              this.ngZone.run(() => {
                this.router.navigateByUrl('/');
              });
            });

          
        }, function(error: any) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
