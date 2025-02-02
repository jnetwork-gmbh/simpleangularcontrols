import { Component } from '@angular/core';
import { ServiceConfirm } from '@simpleangularcontrols/sac-bootstrap4';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
})
export class DemoConfirmComponent {
  // #region Constructors

  constructor(private confirmService: ServiceConfirm) {}

  // #endregion Constructors

  // #region Public Methods

  public confirmExample(): void {
    this.confirmService
      .ConfirmMessage('Benutzer löschen', 'Soll der Benutzer gelöscht werden?')
      .subscribe((result) => {
        console.log('Action called');
        if (result === 'yes') {
          alert('True');
        } else {
          alert('False');
        }
      });
  }

  public confirmExample2(): void {
    this.confirmService
      .ConfirmMessage(
        'Benutzer löschen',
        'Soll der Benutzer gelöscht werden?',
        [
          { key: 'ok', text: 'OK', role: 'primary' },
          { key: 'cancel', text: 'Abbrechen' },
        ]
      )
      .pipe(take(1))
      .subscribe((result) => {
        console.log('Action called');
        if (result === 'ok') {
          alert('True');
        } else {
          alert('False');
        }
      });
  }

  // #endregion Public Methods
}
