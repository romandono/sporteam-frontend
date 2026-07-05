import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { Entrenador } from '../../../models/usuarios/entrenador.model';
import { EntrenadorService } from '../../../services/entrenador.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-entrenador',
    templateUrl: './entrenador.component.html',
    styles: [],
    standalone: false
})
export class EntrenadorComponent implements OnInit {

  public entrenador!: Entrenador;
  public entrenadorPorteros: string = '';
  public image: string = '';
  public nombre: string = '';
  public apellidos: string = '';
  public email: string = '';
  public estadoDeportivo: string = '';
  public nombreZona: string = '';
  public fechaNacimiento: string = '';
  public nombreDeportivo: string = '';
  public clubNombre: string = '';
  public telefono: number = 0;
  public titulacion: string = '';

  constructor(private entrenadorService: EntrenadorService,
              private activatedRoute: ActivatedRoute,
              private location: Location) {
               }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      if (!id) {
        console.error('ID de entrenador no proporcionado');
        return;
      }
      this.cargarEntrenador(id);
    });
  }

  cargarEntrenador(id: string) {
    if (!id) {
      console.error('cargarEntrenador: ID inválido');
      return;
    }
    this.entrenadorService.cargarEntrenador(id)
        .subscribe(entrenador => {
          this.entrenador = entrenador;
          this.entrenador = entrenador;
          this.image = entrenador.imageUrl;
          this.nombre = entrenador.nombre;
          this.apellidos = entrenador.apellidos;
          this.email = entrenador.email;
          this.estadoDeportivo = entrenador.estadoDeportivo!;
          this.nombreDeportivo = entrenador.nombreDeportivo!;
          this.clubNombre = entrenador.club?.nombre!;
          this.telefono = entrenador.telefono!;
          this.titulacion = entrenador.titulacion![0];
          if (this.entrenador.entrenadorPorteros === false) {
            this.entrenadorPorteros = 'No';
          } else {
            this.entrenadorPorteros = 'Si';
          }
        });
  }

  goBack() {
    this.location.back();
  }

}
