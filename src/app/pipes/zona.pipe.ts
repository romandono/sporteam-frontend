import { Pipe, PipeTransform } from '@angular/core';
import { Zona } from '../models/zona.model';

@Pipe({
    name: 'zona',
    standalone: false
})
export class ZonaPipe implements PipeTransform {

  transform(args: Zona[]): string {
    let result: string = '';
    args.forEach(element => {
      result = result + element.nombreZona + ', ';
    });
    result = result.replace(/,\s*$/, "");
    return result;
  }

}
