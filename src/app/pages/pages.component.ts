import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  year = new Date().getFullYear();

  constructor(private settingsServics: SettingsService) { }

  ngOnInit(): void {
  }

}
