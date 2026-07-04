import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entrenadorPorteros',
    standalone: false
})
export class EntrenadorPorterosPipe implements PipeTransform {

  transform(value: boolean): string {

    if (value === null || value === undefined) {
      return '';
    }
    if (value === false) {
      return 'No';
    } else {
      return 'Si';
    }
  }

}
