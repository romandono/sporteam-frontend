import { Zona } from './../../../models/zona.model';
import { Component, OnInit } from '@angular/core';
import { Club } from '../../../models/club.model';
import { Subscription } from 'rxjs';
import { ClubService } from '../../../services/club.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Provincia } from '../../../models/provincia.model';
import { ZonaService } from '../../../services/zona.service';
import * as _ from 'lodash';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styles: [
  ]
})
export class ClubsComponent implements OnInit {

  public totalClubs: number = 0;
  public clubs: Club[] = [];
  public clubsTemp: Club[] = [];
  public desde: number = 0;
  public ultimaPagina: boolean = false;
  public primeraPagina: boolean = false;
  public cargando: boolean = true;
  public imgSubs!: Subscription;
  public clubForm!: FormGroup;
  public provincias: Provincia[] = [];
  public zonas: Zona[] = [];
  public zona: string = '';
  public nombre: string = '';
  p: number = 1;

  public filters: any = [];

  constructor(private clubService: ClubService,
    public usuarioService: UsuarioService,
    public modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
    private zonaService: ZonaService,
    private fb: FormBuilder) { }

    ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
    }
  
    ngOnInit(): void {

      this.clubService.getProvincias().subscribe(resp => this.provincias = resp.provincias);
      this.zonaService.getZonas().subscribe(resp => this.zonas = resp.zonas);

      // Crear formulario
      this.clubForm = this.fb.group({
        nombre: ['', Validators.required],
        localidad: ['', Validators.required],
        provincia: ['', Validators.required],
        modalidad: ['', Validators.required],
        zona: ['', Validators.required]
      });

      this.cargarClubs();
      this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.cargarClubs();
      });
    }

  cargarClubs() {
    this.cargando = true;
    this.clubService.getClubs(this.desde)
    .subscribe( ({total, clubs}) => {
      this.totalClubs = total;
      this.clubs = clubs;
      this.clubsTemp = clubs;
      console.log(clubs);
      this.cargando = false;
      const totalPages = Math.ceil(total / 5);
      const currentPage = Math.ceil((this.desde - 1) / this.totalClubs) + 1;
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
    } else if(this.desde >= this.totalClubs) {
      this.desde -= valor;
    }

    this.cargarClubs();
  }

  eliminarClub(club: Club) {
    Swal.fire({
      title: '¿Eliminar club?',
      text: `Está a punto de eliminar a ${club.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        
        this.clubService.eliminarClub(club)
          .subscribe(resp => {
            this.cargarClubs();
            Swal.fire(
              'Club borrado',
              `${club.nombre} fue eliminado correctamente`,
              'success'
            )
          });

      }
    });
  }

  abrirModal(club: Club) {
    this.modalImagenService.abrirModal('clubs', club._id || '', club.image);
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.clubs = this.clubsTemp;
    }
    this.busquedaService.buscarClubs('clubs', termino)
        .subscribe((resultados) => {
          this.clubs = resultados;
        });
  }

  crearClub() {
    
    this.clubService.crearClub(this.clubForm.value)
        .subscribe(resp => {
          Swal.fire('Ok!', `El club ${resp.club.nombre} fue creado con éxito`, 'success');
          this.cargarClubs();
          document.getElementById('closeModal')?.click();
        }, err => {
          Swal.fire('Error', 'Error al crear el club', 'error');
        });
  }
  
  private applyFilters() {
    console.log('Filtros');
    this.clubsTemp = _.filter(this.clubs, _.conforms(this.filters));
  }

  filterValue(property: string, rule: string) {
    this.filters[property] = (val: string | undefined) => _.includes(_.toLower(val), _.toLower(rule));
    console.log(this.filters);
    this.applyFilters();
  }

  filterZona(rule: string) {
    this.clubsTemp = _.filter(this.clubs, {zona: {_id: rule}});
  }

  cleanFilters() {
    this.filters = {};
    this.applyFilters();
  }
}
