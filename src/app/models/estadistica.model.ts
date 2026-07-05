

export class Estadistica {

    constructor(
        public id: string,
        public partidosJugados: number,
        public goles: number,
        public asistencias: number,
        public tarjetasAmarillas: number,
        public tarjetasRojas: number,
        public temporada: string
    ) {}
}