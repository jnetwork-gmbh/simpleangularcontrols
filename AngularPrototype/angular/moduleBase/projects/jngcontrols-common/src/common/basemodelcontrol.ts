import { Input, Host, OnInit, Injector } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, NgControl } from '@angular/forms';
import { NgFormularCommon } from '../controls/form/form';


export abstract class NgBaseModelControl<VALUE> implements ControlValueAccessor, Validator, OnInit {

  // #region Private Variables

  // Parent Formular
  protected parent: NgFormularCommon;
  // NgModel Form ist disabled
  protected _disabledForm: boolean = false;
  private ngControl: NgControl;

  // #endregion

  // #region Constructor

  // Konstruktor
  // Inject des Formulars
  constructor(@Host() parent: NgFormularCommon, private injector: Injector) {
    this.parent = parent;
  }

  // #endregion

  // #region Control Events

  // Init Event
  ngOnInit() {
    this.ngControl = this.injector.get(NgControl, null);

    // Label Size von Formular lesen
    if (this._labelsize === undefined) {
      if (this.parent.labelsize !== undefined) {
        this._labelsize = this.parent.labelsize;
      } else {
        this._labelsize = 4;
      }
    }

    // Adaptive Label from Form
    if (this._isadaptivelabel === undefined) {
      if (this.parent.isadaptivelabel !== undefined) {
        this._isadaptivelabel = this.parent.isadaptivelabel;
      } else {
        this._isadaptivelabel = false;
      }
    }

    this.OnClassInit();
  }

  // #endregion

  // #region Implementation ControlValueAccessor

  // Leere Implementation von "propagateChange". Muss gemacht werden, damit kein Fehler entsteht
  propagateChange: any = () => { };
  // Leere Implementation von "propagateTouch". Muss gemacht werden, damit kein Fehler entsteht
  propagateTouch: any = () => { };

  // Methode, damit andere Controls änderungen im Control mitbekommen können
  // Zur Änderungsinfo die Methode propagateChange aufrufen.
  registerOnChange(fn: any): void {
    this.propagateChange = (obj) => fn(obj);
  }

  // Methode, damit andere Controls änderungen mitbekommen, wenn das Control aktiviert (Focus) wird.
  registerOnTouched(fn: any): void {
    this.propagateTouch = (obj) => fn(obj);
  }

  // Methode zum schreiben von Werten aus dem Model in das Control
  writeValue(value: VALUE) {
    this._value = value;
  }

  // Setzt das Control auf Disabled
  setDisabledState(isDisabled: boolean): void {
    this._disabledForm = isDisabled;
  }

  // #endregion

  // #region Control Value

  // Interne Variable, die den Wert des Controls hält
  protected _value: VALUE = null;

  // Set Methode für NgModel Binding in Html Markup
  // Input wird benötigt, damit der Wert auch über das Markup gesetzt werden kann.
  @Input("value")
  set value(v: VALUE) {
    this._value = this.ConvertInputValue(v);
    this.propagateChange(this._value);
  }

  // Get Methode für NgModel Binding in Html Markup
  get value(): VALUE {
    return this._value;
  }

  setValue(v: VALUE): void {
    this.value = v;
  }

  // #endregion

  // #region Properties

  // Name des Controls
  @Input("name") _name: string = '';
  // Definiert den Label Text
  @Input("label") _label: string = '';
  // Definiert die Labelgröse
  @Input("labelsize") _labelsize: number = undefined;
  // Deaktiviert das Label im Template
  @Input("disablelabel") _disablelabel: boolean = false;
  // Deaktiviert das Input Control
  @Input("disabled") _disabledControl: boolean = false;
  // Kontroliert, ob das Label adaptive ist
  @Input("isadaptivelabel") _isadaptivelabel: boolean = undefined;
  // Definiert, ob das Control Sprachspezifisch ist
  @Input("islanguagespecific") _islanguagespecific: boolean = false;


  // Definiert ob das Control disabled ist
  get isdisabled(): boolean {
    return this._disabledForm || this._disabledControl;
  }

  // #endregion

  // #region Internal Properties

  // Berechnet die Breite des Labels
  get _inputsize(): number {
    return 12 - this._labelsize;
  }

  // #endregion

  // #region Protected Helper Methods

  protected OnClassInit(): void {
    // Method can be used to Set Properties at Class Init
  }

  protected GetDecimalSymbol(): string {
    return ".";
  }

  protected ConvertInputValue(value: VALUE): VALUE {
    return value;
    // Method can Overwriten in Parent Classes
  }

  // #endregion

  //#region Validation Base

  // Validator
  protected _onChange: () => void;

  validate(c: AbstractControl): ValidationErrors | null {
    let error: ValidationErrors | null = this.validateData(c);
    return error;
  }

  abstract validateData(c: AbstractControl): ValidationErrors | null;

  registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

  protected _dirty: boolean = false;
  public get dirty(): boolean {
    if (this.ngControl !== null) {
      this._dirty = this.ngControl.dirty;
    }

    return this._dirty;
  }

  protected _touched: boolean = false;
  public get touched(): boolean {
    if (this.ngControl !== null) {
      this._touched = this.ngControl.touched;
    }

    return this._touched;
  }
  
  public get invalid(): boolean { return this.ngControl !== undefined && this.ngControl !== null && this.ngControl.invalid; }

  onTouch(): void {
    this._touched = true;
    this.propagateTouch();
  }

  //#endregion
}
