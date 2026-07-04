import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuarios/usuario.model';

declare function customInitFunctions(): any;

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [],
    standalone: false
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  public usuario: Usuario;

  constructor(private sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
    this.menuItems = this.sidebarService.menu;
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
    customInitFunctions();
  }

  logout() {
    this.usuarioService.logout();
  }

}
