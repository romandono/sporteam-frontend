import { Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'sporteam-frontend';
}
