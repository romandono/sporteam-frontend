

export class Estadistica {

    constructor(
        public _id: string,
        public partidosJugados: number,
        public goles: number,
        public asistencias: number,
        public tarjetasAmarillas: number,
        public tarjetasRojas: number,
        public temporada: string
    ) {}
}