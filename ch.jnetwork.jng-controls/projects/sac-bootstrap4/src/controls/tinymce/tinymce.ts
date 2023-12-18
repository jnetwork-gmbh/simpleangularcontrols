import { Component, forwardRef, Host, Injector, NgZone } from '@angular/core';
import {
  ControlContainer,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SacTinyMceCommon } from '@jnetwork/sac-common';
import { SacFormDirective } from '../form/form';

/**
 * TinyMCE Komponente
 */
@Component({
  selector: 'sac-tinymce',
  templateUrl: './tinymce.html',
  // Value Access Provider registrieren, damit Wert via Model geschrieben und gelesen werden kann
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SacTinyMceComponent,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SacTinyMceComponent),
      multi: true,
    },
  ],
  // View Provider, damit das Formular an das Control gebunden werden kann
  viewProviders: [
    { provide: ControlContainer, useExisting: SacFormDirective },
  ],
})
export class SacTinyMceComponent extends SacTinyMceCommon {
  /**
   * Konstruktor
   * @param parent Formular
   * @param injector Angular Dependency Injection Service
   * @param ngZone ngZone
   */
  constructor(
    @Host() parent: SacFormDirective,
    injector: Injector,
    ngZone: NgZone
  ) {
    super(parent, injector, ngZone);
  }
}
