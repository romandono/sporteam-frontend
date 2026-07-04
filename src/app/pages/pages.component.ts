import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styles: [],
    standalone: false
})
export class PagesComponent implements OnInit {

  year = new Date().getFullYear();

  constructor(private settingsServics: SettingsService) { }

  ngOnInit(): void {
  }

}
