import {
  ApplicationRef,
  ComponentFactory,
  ComponentRef,
  EventEmitter,
  Injector,
} from '@angular/core';
import { ISacIconService } from '../../interfaces/ISacIconService';
import { ISacLocalisationService } from '../../interfaces/ISacLocalisationService';
import { ISacValidationKeyService } from '../../interfaces/ISacValidationKeyService';
import { IConfirmComponent } from '../../interfaces/iconfirmcomponent';
import {
  SACICON_SERVICE,
  SACLOCALISATION_SERVICE,
  SACVALIDATIONKEY_SERVICE,
  SacDefaultIconService,
  SacDefaultLocalisationService,
  SacDefaultValidationKeyService,
} from '../../services';

/**
 * Basis Klasse für Confirm Service implementation
 */
export abstract class ServiceConfirmCommon {
  // #region Properties

  /**
   * Referenz auf IConfirm Instanz.
   */
  protected component: ComponentRef<IConfirmComponent> = null;
  /**
   * service for default icon in dialog
   */
  protected iconService: ISacIconService;
  /**
   * service for tranlsate default text
   */
  protected localisationService: ISacLocalisationService;
  /**
   * Service to receive standard validation message keys and texts
   */
  protected validationKeyService: ISacValidationKeyService;

  // #endregion Properties

  // #region Constructors

  /**
   * Konstruktor
   * @param appRef ApplicationRef zum Anhängen des Dialogs an den Content
   * @param injector Injector um die Instanz zu erzeuge
   */
  constructor(private appRef: ApplicationRef, private injector: Injector) {
    this.validationKeyService = injector.get(
      SACVALIDATIONKEY_SERVICE,
      new SacDefaultValidationKeyService()
    );
    this.localisationService = injector.get(
      SACLOCALISATION_SERVICE,
      new SacDefaultLocalisationService(this.validationKeyService)
    );

    this.iconService = injector.get(
      SACICON_SERVICE,
      new SacDefaultIconService()
    );
  }

  // #endregion Constructors

  // #region Protected Methods

  /**
   * Blendet den Dialog aus
   */
  protected CloseDialog(): void {
    const dialog = this.component.instance;
    dialog.hide();
  }

  /**
   * Interne Methode für die Implementation des Confirm Dialogs. Steuert die Feedbacks, die Erzeugung und Anzeige des Dialogs
   */
  protected Confirm(): EventEmitter<string> {
    // Dialog erzeugen
    this.CreateInstance();
    const instance: IConfirmComponent = this.OpenDialog();

    // Konfiguration der Dialog Instanz durch Service Implementation zulassen
    this.ConfigureDialog(instance);

    // Event Emitter für Confirmation im Service. Event Emitter Asynchron initialiseren
    const confirmTask: EventEmitter<string> = new EventEmitter<string>(true);

    // Callback wenn Dialog bestätigt wurde
    instance.onconfirm.subscribe(
      (value) => {
        // Dialog entfernen
        this.CloseDialog();

        // Emit auf Service auslösen
        confirmTask.emit(value);
      },
      (err) => {
        // Do nothing on Error
      },
      () => {
        this.DestroyInstance();
      }
    );

    // Confirm Emitter für Result zurückgeben
    return confirmTask;
  }

  /**
   * Erzeugt eine Instanz für den Dialog
   */
  protected CreateInstance(): void {
    // ComponentFactory aus Service laden
    const factory: ComponentFactory<IConfirmComponent> =
      this.GetComponentFactory();

    // Instanz der Komponente erzeugen und an die View anhängen
    this.component = factory.create(this.injector);
    this.appRef.attachView(this.component.hostView);
  }

  /**
   * Entfernt die Instanz des Dialogs
   */
  protected DestroyInstance(): void {
    // Dialog aus View entfernen und Komponenten löschen
    this.appRef.detachView(this.component.hostView);
    this.component.destroy();
  }

  /**
   * Zeigt den Dialog an
   */
  protected OpenDialog(): IConfirmComponent {
    const dialog = this.component.instance;
    dialog.show();
    return dialog as IConfirmComponent;
  }

  // #endregion Protected Methods

  // #region Protected Abstract Methods

  /**
   * Methode zur Konfiguration der Confirm Dialog Komponente
   * @param instance Instanz auf IConfirmComponent Komponente
   */
  protected abstract ConfigureDialog(instance: IConfirmComponent);
  /**
   * Abstrakte Methode zum erzeugen der Komponent Factory für den Dialog
   */
  protected abstract GetComponentFactory(): ComponentFactory<IConfirmComponent>;

  // #endregion Protected Abstract Methods
}
