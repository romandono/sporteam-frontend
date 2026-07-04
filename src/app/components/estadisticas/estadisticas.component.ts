import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import { EstadisticaService } from '../../services/estadistica.service';
import { Estadistica } from '../../models/estadistica.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  public estadistica!: Estadistica;
  public partidosJugados: number = 0;
  public goles: number = 0;
  public asistencias: number = 0;
  public tarjetasAmarillas: number = 0;
  public tarjetasRojas: number = 0;
  @Input('id') idEstadistica!: string;

  constructor(private estadisticaService: EstadisticaService) { }

  ngOnInit(): void {
    this.estadisticaService.getEstadistica(this.idEstadistica)
        .subscribe(estadistica => {
          this.estadistica = estadistica;
          this.partidosJugados = estadistica.partidosJugados;
          this.goles = estadistica.goles;
          this.asistencias = estadistica.asistencias;
          this.tarjetasAmarillas = estadistica.tarjetasAmarillas;
          this.tarjetasRojas = estadistica.tarjetasRojas;
          console.log(this.estadistica);
        });
  }

}
