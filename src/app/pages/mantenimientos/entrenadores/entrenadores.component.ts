import { Zona } from './../../../models/zona.model';
import { Entrenador } from './../../../models/usuarios/entrenador.model';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { EntrenadorService } from '../../../services/entrenador.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';
import { Club } from '../../../models/club.model';
import { ZonaService } from '../../../services/zona.service';
import { ClubService } from '../../../services/club.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'app-entrenadores',
    templateUrl: './entrenadores.component.html',
    styles: [],
    standalone: false
})
export class EntrenadoresComponent implements OnInit, OnDestroy {

  public totalEntrenadores: number = 0;
  public entrenadores: Entrenador[] = [];
  public entrenadoresTemp: Entrenador[] = [];
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
  public estados: string[] = [
    'Sin equipo',
    'En activo'
  ];
  p: number = 1;

  filters: any = {};

  public entrenador: Entrenador = new Entrenador('','','');

  constructor(public usuarioService: UsuarioService,
    private entrenadorService: EntrenadorService,
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
    this.cargarEntrenadores();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      this.cargarEntrenadores();
    });
  }

  cargarEntrenadores() {
    this.cargando = true;
    this.entrenadorService.getEntrenadores(this.desde)
    .subscribe( ({total, entrenadores}) => {
      this.totalEntrenadores = total;
      this.entrenadores = entrenadores;
      this.entrenadoresTemp = entrenadores;
      this.cargando = false;
      const totalPages = Math.ceil(total / 5);
      const currentPage = Math.ceil((this.desde - 1) / this.totalEntrenadores) + 1;
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
    } else if(this.desde >= this.totalEntrenadores) {
      this.desde -= valor;
    }

    this.cargarEntrenadores();
  }

  eliminarEntrenador(entrenador: Entrenador) {

    if (entrenador.id === this.usuarioService.id) {
      return Swal.fire('Atención', 'No puede eliminarse a si mismo', 'warning');
    }

    Swal.fire({
      title: '¿Eliminar entrenador?',
      text: `Está a punto de eliminar a ${entrenador.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        
        this.entrenadorService.eliminarEntrenador(entrenador)
          .subscribe(resp => {
            this.cargarEntrenadores();
            Swal.fire(
              'Usuario borrado',
              `${entrenador.nombre} fue eliminado correctamente`,
              'success'
            )
          });

      }
    });
  }

  abrirModal(entrenador: Entrenador) {
    this.modalImagenService.abrirModal('usuarios', entrenador.id || '', entrenador.image);
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.entrenadores = this.entrenadoresTemp;
    }
    this.busquedaService.buscar('entrenadores', termino)
        .subscribe(resultados => {
          this.entrenadores = resultados;
        });
  }

  private applyFilters() {
    this.entrenadoresTemp = _.filter(this.entrenadores, _.conforms(this.filters));
  }

  filterValue(property: string, rule: string) {
    this.filters[property] = (val: string | undefined) => _.includes(_.toLower(val), _.toLower(rule));
    this.applyFilters();
  }

  cleanFilters() {
    this.filters = {};
    this.applyFilters();
  }
}
