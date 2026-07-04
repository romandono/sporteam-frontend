import { Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'app-nopagefound',
    templateUrl: './nopagefound.component.html',
    styleUrls: ['./nopagefound.component.css'],
    standalone: false
})
export class NopagefoundComponent {

  year = new Date().getFullYear();

  constructor() { }

}
