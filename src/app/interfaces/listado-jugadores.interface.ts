import { Jugador } from '../models/usuarios/jugador.model';
export interface ListadoJugadores {
    total: number;
    jugadores: Jugador[];
}