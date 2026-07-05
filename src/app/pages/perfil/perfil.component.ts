import { Zona } from './../../models/zona.model';
import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuarios/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';
import { ZonaService } from '../../services/zona.service';
import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club.model';
import { JugadorService } from '../../services/jugador.service';
import { EntrenadorService } from '../../services/entrenador.service';
import { Jugador } from '../../models/usuarios/jugador.model';
import { Entrenador } from '../../models/usuarios/entrenador.model';

import dayjs from 'dayjs';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styles: [],
    standalone: false
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public jugador!: Jugador;
  public fecha: Date = new Date();
  public entrenador!: Entrenador;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public zonas: Zona[] = [];
  public clubs: Club[] = [];
  public estados: string[] = [
    'Sin equipo',
    'En activo'
  ];
  public roles: any[] = [{
    role: 'JUGADOR_ROLE',
    usertype: 'Jugador'
  },{
    role: 'ENTRENADOR_ROLE',
    usertype: 'Entrenador'
  },{
    role: 'USER_ROLE',
    usertype: 'Usuario'
  }];
  public isVisible: boolean = false;
  public selectedZonas: Zona[] = [];

  constructor(private fb: FormBuilder,
              public usuarioService: UsuarioService,
              private jugadorService: JugadorService,
              private entrenadorService: EntrenadorService,
              private fileUploadService: FileUploadService,
              private zonaService: ZonaService,
              private clubService: ClubService) { 
                this.usuario = usuarioService.usuario;
                
                this.zonaService.getZonas()
                    .subscribe( ({zonas}) => {
                      this.zonas = zonas;
                    });
                this.clubService.getClubs()
                    .subscribe( ({clubs}) => {
                      this.clubs = clubs;
                    });
              }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      apellidos: [this.usuario.apellidos, [Validators.required]],
      zona: ["", Validators.required],
      estadoDeportivo: [this.usuario.estadoDeportivo, [Validators.required]],
      role: [null, Validators.required],
      club: [""],
      nombreDeportivo: [this.jugador?.nombreDeportivo],
      fechaNacimiento: [this.jugador?.fechaNacimiento ? new Date(this.jugador.fechaNacimiento!) : null],
      lateralidad: [this.jugador?.lateralidad],
      demarcacion: [this.jugador?.demarcacion],
      altura: [this.jugador?.altura],
      peso: [this.jugador?.peso],
      titulacion: [this.entrenador?.titulacion],
      telefono: [this.entrenador?.titulacion, Validators.maxLength(9)],
      entrenadorPorteros: [this.entrenador?.entrenadorPorteros]
    });

    this.clubVisible();

    if (this.usuarioService.usuario.role === 'JUGADOR_ROLE') {
      this.jugadorService.cargarJugador(this.usuarioService.id)
        .subscribe(jugador => {
          this.jugador = jugador;
          this.perfilForm.controls['nombreDeportivo'].setValue(this.jugador.nombreDeportivo);
          this.perfilForm.controls['fechaNacimiento'].setValue(new Date(this.jugador.fechaNacimiento!));
          this.perfilForm.controls['lateralidad'].setValue(this.jugador.lateralidad);
          this.perfilForm.controls['demarcacion'].setValue(this.jugador.demarcacion);
          this.perfilForm.controls['altura'].setValue(this.jugador.altura);
          this.perfilForm.controls['peso'].setValue(this.jugador.peso);
          this.perfilForm.controls['zona']?.patchValue(this.usuario.zona);
          this.perfilForm.controls['role'].setValue(this.usuario.role, {onlySelf: true});
          this.perfilForm.controls['club']?.patchValue(this.usuario.club);
        });
    } else  if (this.usuarioService.usuario.role === 'ENTRENADOR_ROLE') {
      this.entrenadorService.cargarEntrenador(this.usuarioService.id)
        .subscribe(entrenador => {
          this.entrenador = entrenador;
          this.perfilForm.controls['nombreDeportivo'].setValue(this.entrenador.nombreDeportivo);
          this.perfilForm.controls['titulacion'].setValue(this.entrenador.titulacion);
          this.perfilForm.controls['telefono'].setValue(this.entrenador.telefono);
          this.perfilForm.controls['entrenadorPorteros'].setValue(this.entrenador.entrenadorPorteros);
          this.perfilForm.get('zona')?.patchValue(this.usuario.zona);
          this.perfilForm.controls['role'].setValue(this.usuario.role, {onlySelf: true});
          this.perfilForm.get('club')?.patchValue(this.usuario.club);
        });
    }
  }

  actualizarPerfil() {

    switch(this.usuario.role) {
      case 'JUGADOR_ROLE':
        if (this.perfilForm.controls['estadoDeportivo'].value === 'Sin equipo') {
          this.eliminarClub();
        }
        console.log(this.perfilForm.value);

        const jugadorId = this.jugador?.id || this.usuarioService.id;
        if (!jugadorId) {
          Swal.fire('Error', 'ID de usuario no disponible', 'error');
          return;
        }
        console.log('Actualizando jugador con ID:', jugadorId);
        this.jugadorService.actualizarJugador(jugadorId, this.perfilForm.value)
            .subscribe(resp => {
              const {nombre, apellidos, zona, estadoDeportivo, club, role} = this.perfilForm.value;
              this.usuario.nombre = nombre;
              this.usuario.apellidos = apellidos;
              this.usuario.estadoDeportivo = estadoDeportivo;
              this.usuario.role = role;
              this.usuario.zona = zona;
              this.usuario.club = club;
              Swal.fire('Guardado', 'Los cambios se guardaron correctamente', 'success');
            }, err => {
              Swal.fire('Error', err.error?.message || err.message || 'Error al guardar', 'error');
            });
      break;
      case 'ENTRENADOR_ROLE':
        if (this.perfilForm.controls['estadoDeportivo'].value === 'Sin equipo') {
          this.eliminarClub();
        }
        const entrenadorId = this.entrenador?.id || this.usuarioService.id;
        if (!entrenadorId) {
          Swal.fire('Error', 'ID de usuario no disponible', 'error');
          return;
        }
        this.entrenadorService.actualizarEntrenador(entrenadorId, this.perfilForm.value)
            .subscribe(resp => {
              const {nombre, apellidos, zona, estadoDeportivo, club, role} = this.perfilForm.value;
              this.usuario.nombre = nombre;
              this.usuario.apellidos = apellidos;
              this.usuario.estadoDeportivo = estadoDeportivo;
              this.usuario.role = role;
              Swal.fire('Guardado', 'Los cambios se guardaron correctamente', 'success');
            }, err => {
              Swal.fire('Error', err.error?.message || err.message || 'Error al guardar', 'error');
            });
      break;
      case 'USER_ROLE':
        this.usuarioService.actualizarUsuario(this.perfilForm.value)
        .subscribe( resp => {
          const {nombre, apellidos, zona, estadoDeportivo, club, role} = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.apellidos = apellidos;
          this.usuario.estadoDeportivo = estadoDeportivo;
          this.usuario.role = role;
          Swal.fire('Guardado', 'Los cambios se guardaron correctamente', 'success');
        }, err => {
          Swal.fire('Error', err.error?.message || err.message || 'Error al guardar', 'error');
        });
      break;
    }
      
  }

  cambiarImagen(event: any) {
    this.imagenSubir = event.target.files[0];

    if (!this.imagenSubir) {this.imgTemp = null;}

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.id || '')
      .then(img => {
        this.usuario.image = img;
        Swal.fire('Guardado', 'Avatar de usuario actualizada', 'success');
      }).catch( err => {
        Swal.fire('Error', 'No se ha podido cambiar el avatar', 'error');
      });
  }

  clubVisible() {
    if (this.perfilForm.controls['estadoDeportivo'].value === 'En activo') {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  eliminarClub() {
    this.perfilForm.controls['club'].setValue(null);
  }

  compareWith(option1: any, option2: any): boolean {
    return option1 && option2 && option1._id === option2._id;
   }

}
