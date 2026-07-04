import { I18nPluralPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  @Input('valor') progreso: number = 50;
  @Input() btnClass: string = 'btn-primary';

  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();

  cambiarValor(valor: number) {

    if (this.progreso >= 100 && valor >= 0) {
      this.progreso = 100;
    }else if (this.progreso <= 0 && valor < 0) {
       this.progreso = 0;
    } else {
      this.progreso = this.progreso + valor;
    }

    this.valorSalida.emit(this.progreso);
    return this.progreso;
  }

  onChange(nuevoValor: number) {
    
    if (nuevoValor >= 100) {
      this.progreso = 100;
    } else if(nuevoValor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
  }

}
