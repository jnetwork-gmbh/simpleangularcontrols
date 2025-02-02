import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  forwardRef,
  Injector,
  TemplateRef,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SacGridCommon } from '@simpleangularcontrols/sac-common';

/**
 * Grid Komponente
 */
@Component({
  selector: 'sac-grid',
  templateUrl: './grid.html',
  // Value Access Provider registrieren, damit Wert via Model geschrieben und gelesen werden kann
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SacGridComponent },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => SacGridComponent),
    },
  ],
})
export class SacGridComponent extends SacGridCommon {
  // #region Properties

  /**
   * Referenz auf Column Template
   */
  @ContentChild(TemplateRef, { static: false })
  public template: TemplateRef<any>;

  /**
   * Setzt die Ellipsis Funktion auf der Column
   */
  public ellipsis: boolean = false;

  // #endregion Properties

  // #region Constructors

  /**
   * Konstrukor
   * @param cdRef Change Detection Reference
   */
  constructor(cdRef: ChangeDetectorRef, injector: Injector) {
    super(cdRef, injector);
  }

  // #endregion Constructors
}
