import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { JugadoresComponent } from './mantenimientos/jugadores/jugadores.component';
import { EntrenadoresComponent } from './mantenimientos/entrenadores/entrenadores.component';
import { ClubsComponent } from './mantenimientos/clubs/clubs.component';
import { JugadorComponent } from './mantenimientos/jugadores/jugador.component';
import { EntrenadorComponent } from './mantenimientos/entrenadores/entrenador.component';


const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
          { path: '', component: DashboardComponent, data: {titulo: 'Tablero'}},
          { path: 'perfil', component: PerfilComponent, data: {titulo: 'Mi perfil'}},
          { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
          { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica'}},
          { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de cuenta'}},

          // Mantenimientos
          { path: 'jugadores', component: JugadoresComponent, data: {titulo: 'Jugadores'}},
          { path: 'jugador/:id', component: JugadorComponent, data: {titulo: 'Jugadores'}},
          { path: 'entrenadores', component: EntrenadoresComponent, data: {titulo: 'Enternadores'}},
          { path: 'entrenador/:id', component: EntrenadorComponent, data: {titulo: 'Enternadores'}},
          { path: 'clubs', component: ClubsComponent, data: {titulo: 'Clubs'}}
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
