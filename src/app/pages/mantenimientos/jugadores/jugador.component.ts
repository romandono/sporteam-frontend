import { Zona } from './../../../models/zona.model';
import { Component, OnInit } from '@angular/core';
import { Jugador } from '../../../models/usuarios/jugador.model';
import { JugadorService } from '../../../services/jugador.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styles: [
  ]
})
export class JugadorComponent implements OnInit {

  public jugador!: Jugador;
  public image: string = '';
  public nombre: string = '';
  public apellidos: string = '';
  public email: string = '';
  public estadoDeportivo: string = '';
  public zona: Zona[] = [];
  public fechaNacimiento: string = '';
  public nombreDeportivo: string = '';
  public clubNombre: string = '';
  public lateralidad: string = '';
  public demarcacion: string = '';
  public altura: number = 0;
  public peso: number = 0;
  public id: string = '';
  public estadisticas: string[] = [];

  constructor(private jugadorService: JugadorService,
              private activatedRoute: ActivatedRoute,
              private location: Location) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.cargarJugador(id);
      this.id = id;
    });
  }

  cargarJugador(id: string) {
    this.jugadorService.cargarJugador(id)
        .subscribe(jugador => {
          console.log(jugador);
          this.jugador = jugador;
          this.image = jugador.imageUrl;
          this.nombre = jugador.nombre;
          this.apellidos = jugador.apellidos;
          this.email = jugador.email;
          this.estadoDeportivo = jugador.estadoDeportivo!;
          this.fechaNacimiento = moment(jugador.fechaNacimiento!).format('DD/MM/yyyy');
          this.nombreDeportivo = jugador.nombreDeportivo!;
          this.clubNombre = jugador.club?.nombre!;
          this.zona = jugador.zona!;
          this.lateralidad = jugador.lateralidad!;
          this.demarcacion = jugador.demarcacion!;
          this.altura = jugador.altura!;
          this.peso = jugador.peso!;
          this.estadisticas = jugador.estadisticas!;
        });
  }

  goBack() {
    this.location.back();
  }

}
