import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [
    {
      title: 'Accede a',
      icono: 'mdi mdi-view-dashboard',
      submenu: [
        {titulo: 'Tablero', url: '/'}
      ]
    },

    {
      title: 'Búsquedas',
      icono: 'mdi mdi-account-search',
      submenu: [
        {titulo: 'Jugadores', url: './jugadores'},
        {titulo: 'Entrenadores', url: './entrenadores'},
        {titulo: 'Clubs', url: './clubs'},
      ]
    }
  ];

  constructor() { }
}
