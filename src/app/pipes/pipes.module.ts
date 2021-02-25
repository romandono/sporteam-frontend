import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagenPipe } from '../pipes/imagen.pipe';
import { EntrenadorPorterosPipe } from './entrenador-porteros.pipe';
import { ZonaPipe } from './zona.pipe';

@NgModule({
  declarations: [ImagenPipe, EntrenadorPorterosPipe, ZonaPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ImagenPipe,
    EntrenadorPorterosPipe,
    ZonaPipe
  ]
})
export class PipesModule { }
