import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuarios/usuario.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public limite: number = 9;

  public usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios(this.limite);
  }

  cargarMas() {
    this.limite += 9;
    this.cargarUsuarios(this.limite);
  }

  cargarUsuarios(limite: number) {
    this.usuarioService.getUsuarios(limite)
    .subscribe(({total, usuarios}) => {
      this.usuarios = usuarios;
      console.log(this.usuarios);
    });
  }
}
