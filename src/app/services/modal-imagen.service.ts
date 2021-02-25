import { Injectable, EventEmitter } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  public id!: string;
  public tipo!: string;
  public img!: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  private _ocultarModal: boolean = true;

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(tipo: string, id: string, img: string = 'no-image') {
    this.id = id;
    this._ocultarModal = false;
    this.tipo = tipo;
    if (img?.includes('https') || img.includes('http')) {
      this.img = img;
    } else {
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
  }

  abrirModalClubs() {
    this._ocultarModal = false;
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
