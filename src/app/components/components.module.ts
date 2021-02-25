import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { FormsModule } from '@angular/forms';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    ModalImagenComponent,
    EstadisticasComponent
  ],
  exports: [
    IncrementadorComponent,
    ModalImagenComponent,
    EstadisticasComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ComponentsModule { }
