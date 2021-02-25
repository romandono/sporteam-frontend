import { Club } from '../models/club.model';

export interface ListadoClubs {
    total: number;
    clubs: Club[];
}