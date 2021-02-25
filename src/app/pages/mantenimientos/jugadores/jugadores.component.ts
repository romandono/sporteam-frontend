import { Zona } from './../../../models/zona.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Jugador } from '../../../models/usuarios/jugador.model';
import Swal from 'sweetalert2';
import { JugadorService } from '../../../services/jugador.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import * as _ from 'lodash';
import { Club } from '../../../models/club.model';
import { ZonaService } from '../../../services/zona.service';
import { ClubService } from '../../../services/club.service';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styles: [
  ]
})
export class JugadoresComponent implements OnInit, OnDestroy {

  public totalJugadores: number = 0;
  public jugadores: Jugador[] = [];
  public jugadoresTemp : Jugador[] = [];
  public desde: number = 0;
  public ultimaPagina: boolean = false;
  public primeraPagina: boolean = false;
  public cargando: boolean = true;
  public imgSubs!: Subscription;
  public zonas: Zona[] = [];
  public zona: string = '';
  public clubs: Club[] = [];
  public club: string = '';
  public estadoDeportivo: string = '';
  public lateralidad: string = '';
  public demarcacion: string = '';
  public estados: string[] = [
    'Sin equipo',
    'En activo'
  ];
  p: number = 1;

  public jugador: Jugador = new Jugador('','','');

  filters: any = {};

  constructor(public usuarioService: UsuarioService,
              private jugadorService: JugadorService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService,
              private zonaService: ZonaService,
              private clubService: ClubService) { 
                this.zonaService.getZonas()
                    .subscribe( ({zonas}) => {
                      this.zonas = zonas;
                    });
                this.clubService.getClubs()
                  .subscribe( ({clubs}) => {
                    this.clubs = clubs;
                  });
              }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarJugadores();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      this.cargarJugadores();
    });
  }

  cargarJugadores() {
    this.cargando = true;
    this.usuarioService.getJugadores(this.desde)
    .subscribe( ({total, jugadores}) => {
      this.totalJugadores = total;
      this.jugadores = jugadores;
      this.jugadoresTemp = jugadores;
      this.cargando = false;
      const totalPages = Math.ceil(total / 5);
      const currentPage = Math.ceil((this.desde - 1) / this.totalJugadores) + 1;
      if (currentPage === totalPages) {
        this.ultimaPagina = true;
      } else {
        this.ultimaPagina = false;
      }
      if (this.desde === 0) {
        this.primeraPagina = true;
      } else {
        this.primeraPagina = false;
      }
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if(this.desde <0) {
      this.desde = 0;
    } else if(this.desde >= this.totalJugadores) {
      this.desde -= valor;
    }

    this.cargarJugadores();
  }

  eliminarJugador(jugador: Jugador) {

    if (jugador.id === this.usuarioService.id) {
      return Swal.fire('Atención', 'No puede eliminarse a si mismo', 'warning');
    }

    console.log(jugador);
    Swal.fire({
      title: '¿Eliminar jugador?',
      text: `Está a punto de eliminar a ${jugador.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        
        this.jugadorService.eliminarJugador(jugador)
          .subscribe(resp => {
            this.cargarJugadores();
            Swal.fire(
              'Usuario borrado',
              `${jugador.nombre} fue eliminado correctamente`,
              'success'
            )
          });

      }
    });
  }

  abrirModal(jugador: Jugador) {
    this.modalImagenService.abrirModal('usuarios', jugador.id || '', jugador.image);
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.jugadores = this.jugadoresTemp;
    }

    this.busquedaService.buscar('jugadores', termino)
        .subscribe(resultados => {
          this.jugadores = resultados;
        });
  }

  private applyFilters() {
    console.log('Filtros');
    this.jugadoresTemp = _.filter(this.jugadores, _.conforms(this.filters));
  }

  filterValue(property: string, rule: string) {
    this.filters[property] = (val: string | undefined) => _.includes(_.toLower(val), _.toLower(rule));
    console.log(this.jugadoresTemp);
    console.log(this.filters);
    this.applyFilters();
  }

  cleanFilters() {
    this.filters = {};
    this.applyFilters();
  }

}
