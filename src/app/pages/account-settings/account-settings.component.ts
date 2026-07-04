import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styles: [],
    standalone: false
})
export class AccountSettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme();
  }

  changeTheme(theme: string) {

    this.settingsService.changeTheme(theme);

  }

}
