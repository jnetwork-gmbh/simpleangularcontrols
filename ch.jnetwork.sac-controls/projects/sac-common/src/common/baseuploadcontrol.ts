import {
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IdService,
  UPLOADX_AJAX,
  UPLOADX_FACTORY_OPTIONS,
  UPLOADX_OPTIONS,
  UploadState,
  UploadxOptions,
  UploadxService,
} from 'ngx-uploadx';
import { Observable, of } from 'rxjs';
import { SacFormLayoutCommon } from '../controls/layout/formlayout';
import { ISacLocalisationService } from '../interfaces/ISacLocalisationService';
import { IUploadControl } from '../interfaces/iuploadcontrol';
import {
  SACVALIDATIONKEY_SERVICE,
  SacDefaultValidationKeyService,
} from '../services';
import {
  SACLOCALISATION_SERVICE,
  SacDefaultLocalisationService,
} from '../services/sac-localisation.service';
import { Validation } from '../validation';
import { SacBaseModelControl } from './basemodelcontrol';

// #region Classes

/**
 * Base Klasse für Uploader Control
 */
@Directive()
export abstract class SacUploadBase<VALUE>
  extends SacBaseModelControl<VALUE>
  implements OnInit, OnDestroy
{
  // #region Properties

  /**
   * File Input Control
   */
  @ViewChild('files', { static: true })
  private uploadInput: ElementRef;

  /**
   * Erlaubte Dateitypen
   */
  private _allowedtypes: string = '*';
  /**
   * Files automatisch hochladen
   */
  private _autoupload: boolean = false;
  /**
   * Pausieren von Uploads erlauben
   */
  private _enablepause: boolean = true;
  /**
   * API Endpoint
   */
  private _endpoint: string = null;
  /**
   * Upload Settings
   */
  private options: UploadxOptions = {};

  /**
   * Upload Service
   */
  protected uploadService: UploadxService;

  /**
   * Definiert das Control als Required
   */
  @Input() public isrequired: boolean = false;
  /**
   * Max. Dateigrösse für Files die hochgeladen werden können. 0 deaktiviert den Filter
   */
  @Input() public maxfilesize: number = 0;
  /**
   * Resource Key für Validation Message Required bei Control
   */
  @Input() public validationmessagerequired: string =
    this.validationKeyService.ValidationErrorRequired;
  /**
   * Resource Key für Validation Message Required in Validation Summary
   */
  @Input()
  public validationmessagesummaryrequired: string =
    this.validationKeyService.ValidationErrorSummaryRequired;
  /**
   * Event wenn ein Error in der Komponente ausgelöst wird.
   */
  @Output() public onfileerror = new EventEmitter<string>();

  /**
   * Handling von neuen Files im Input Control
   */
  public fileListener = () => {
    if (this.uploadInput.nativeElement.files) {
      this.uploadService.handleFiles(this.uploadInput.nativeElement.files);
    }
  };
  /**
   * Listener für Files
   */
  public listenerFn: () => void;
  /**
   * Service für Error Localisation
   */
  public lngResourceService: ISacLocalisationService;
  /**
   * Array von Uploads
   */
  public uploads: SacUploadFile[];

  // #endregion Properties

  // #region Constructors

  /**
   * Constructor
   * @param formlayout SacFormLayoutCommon to define scoped layout settings
   * @param injector Injector for injecting services
   * @param renderer angular rendering engine
   * @param ngZone ngzone for handling external scripts
   */
  constructor(
    formlayout: SacFormLayoutCommon,
    injector: Injector,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {
    super(formlayout, injector);

    this.validationKeyService = injector.get(
      SACVALIDATIONKEY_SERVICE,
      new SacDefaultValidationKeyService()
    );

    this.lngResourceService = injector.get(
      SACLOCALISATION_SERVICE,
      new SacDefaultLocalisationService(this.validationKeyService)
    );

    this.uploads = [];

    this.options.allowedTypes = '*';
    this.options.concurrency = 1;
    this.options.token = 'sometoken';
    this.options.autoUpload = this._autoupload;
    this.options.withCredentials = true;
    this.options.chunkSize = 1024 * 16 * 8;
    this.options.headers = (f: File) => ({
      'Content-Disposition': `filename=${encodeURI(f.name)}`,
    });

    // Init new Service Instance
    this.uploadService = new UploadxService(
      injector.get(UPLOADX_OPTIONS, null),
      injector.get(UPLOADX_FACTORY_OPTIONS),
      injector.get(UPLOADX_AJAX),
      this.ngZone,
      injector.get(IdService)
    );
    this.uploadService.init(this.options);

    // Subscripe Event for State changes
    this.uploadService.events.subscribe((ufile: UploadState) =>
      this.onUpload(ufile)
    );
  }

  // #endregion Constructors

  // #region Public Getters And Setters

  /**
   * Erlaubte Dateitypen für den Upload. Format: ".xxx,.yyy,.zzz"
   */
  @Input()
  public set allowedtypes(types: string) {
    this._allowedtypes = types;
    this.setAllowedTypes(types);
  }

  /**
   * Files nach der Auswahl automatisch hochladen
   */
  @Input()
  public set autoupload(v: boolean) {
    this._autoupload = v;
    this.options.autoUpload = v;
    this.uploadService.connect(this.options);
  }

  /**
   * Uploads können unterbrochen werden
   */
  @Input()
  public set enablepause(v: boolean) {
    this._enablepause = v;
  }

  /**
   * Definiert den Registration Endpoint für Uploads.
   */
  @Input()
  public set endpoint(v: string) {
    this._endpoint = v;
    this.setEndpoint(v);
  }

  /**
   * Icon for browse button
   */
  public get IconBrowse(): string {
    return this.iconService.UploadComponentBrowseIcon;
  }

  /**
   * icon for continous buttons
   */
  public get IconContinue(): string {
    return this.iconService.UploadComponentContinueIcon;
  }

  /**
   * icon for delete buttons
   */
  public get IconDelete(): string {
    return this.iconService.UploadComponentDeleteIcon;
  }

  /**
   * icon for pause buttons
   */
  public get IconPause(): string {
    return this.iconService.UploadComponentPauseIcon;
  }

  /**
   * icon for upload button
   */
  public get IconUpload(): string {
    return this.iconService.UploadComponentUploadIcon;
  }

  public get allowedtypes(): string {
    return this._allowedtypes;
  }

  public get autoupload(): boolean {
    return this._autoupload;
  }

  public get enablepause(): boolean {
    return this._enablepause;
  }

  public get endpoint(): string {
    return this._endpoint;
  }

  // #endregion Public Getters And Setters

  // #region Public Methods

  /**
   * Name der Datei die Hochgeladen wird
   * @returns Observable des Dateinamens.
   */
  public Filename(): Observable<string> {
    if (this.uploads.length > 0) {
      return of(this.uploads[0].name);
    } else {
      return this.lngResourceService.GetString(
        this.validationKeyService.UploadNoFilesSelected
      );
    }
  }

  /**
   * Gibt an ob Queue Elemente beinhaltet
   * @returns Elemente in der Queue
   */
  public HasQueueItem(): boolean {
    return this.uploads.length > 0;
  }

  /**
   * Gibt an ob ein Upload abgeschlossen ist
   * @returns Upload erfolgreich
   */
  public HasSuccessUpload(): boolean {
    if (this.uploads.length > 0) {
      return (
        this.uploads.filter((itm) => itm.status !== 'complete').length === 0
      );
    } else {
      return false;
    }
  }

  /**
   * Prüft ob ein Upload pausiert
   * @returns Pausierter Upload ist vorhanden
   */
  public IsPaused(): boolean {
    return this.uploads.filter((itm) => itm.status === 'paused').length > 0;
  }

  /**
   * Prüft ob in der Queue Elemente die zum Upload bereit sind vorhanden sind.
   * @returns Elemente für Upload vorhanden
   */
  public IsStateToUpload(): boolean {
    return (
      this.uploads.filter(
        (itm) => itm.status === 'added' || itm.status === 'paused'
      ).length > 0
    );
  }

  /**
   * Prüft ob ein Upload eines Files am laufen ist
   * @returns Upload ist am laufen
   */
  public IsUploading(): boolean {
    return this.uploads.filter((itm) => itm.status === 'uploading').length > 0;
  }

  /**
   * Gibt den Uploadfortschritt zurück
   * @returns Upload Fortschritt. Wert von 0-100
   */
  public Progress(): number {
    if (this.uploads.length > 0) {
      return this.uploads[0].progress;
    } else {
      return 0;
    }
  }

  /**
   * Cancel single upload
   * @param uploadId ID of File to cancel
   */
  public cancel(uploadId) {
    this.uploadService.control({ action: 'cancel', uploadId: uploadId });
  }

  /**
   * Cancel all Uploaded files
   */
  public cancelAll() {
    if (this.HasQueueItem() === true) {
      this.uploadService.control({ action: 'cancel' });
    }
  }

  /**
   * Destroy des Controls
   */
  public ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  /**
   * Initialisiert das Control
   */
  public ngOnInit() {
    super.ngOnInit();
    // Init Event Listener for Input File Control and Handling Files
    this.listenerFn = this.renderer.listen(
      this.uploadInput.nativeElement,
      'change',
      this.fileListener
    );

    this.setAllowedTypes(this._allowedtypes);
    this.setEndpoint(this._endpoint);

    if (this._endpoint === null) {
      throw new Error('endpoint is not defined!');
    }

    this.uploadService.connect(this.options);
  }

  /**
   * Upload Event
   *
   * @param uploadsOutStream Upload Item
   */
  public onUpload(ufile: UploadState) {
    const index = this.uploads.findIndex((f) => f.uploadId === ufile.uploadId);

    if (ufile.status === 'added' || (ufile.status === 'queue' && index < 0)) {
      if (
        this.isExtensionValid(ufile.name) &&
        this.isFileSizeValid(ufile.size) &&
        this.CustomAddValidation(ufile)
      ) {
        this.uploads.push(new SacUploadFile(ufile));
      } else {
        this.cancel(ufile.uploadId);

        if (!this.isExtensionValid(ufile.name)) {
          this.onfileerror.emit('INVALID_EXTENSION');
        } else if (!this.isFileSizeValid(ufile.size)) {
          this.onfileerror.emit('INVALID_FILESIZE');
        }
      }
    } else if (ufile.status === 'cancelled') {
      if (index >= 0) {
        this.uploads.splice(index, 1);
      }

      this.SetUploadValue(null);
    } else if (ufile.status === 'complete') {
      this.uploads[index].progress = ufile.progress;
      this.uploads[index].status = ufile.status;
      this.SetUploadValue(ufile);
    } else {
      if (index >= 0) {
        this.uploads[index].progress = ufile.progress;
        this.uploads[index].status = ufile.status;
      }
    }

    this.UpdateFileCount();
  }

  /**
   * Cancel Single File
   * @param uploadId ID of File to Cancel
   */
  public pause(uploadId) {
    this.uploadService.control({ action: 'pause', uploadId });
  }

  /**
   * Pause all Uploads
   */
  public pauseAll() {
    if (this.IsUploading() === true) {
      this.uploadService.control({ action: 'pause' });
    }
  }

  /**
   * Upload Single File
   *
   * @param uploadId ID of File to Upload
   */
  public upload(uploadId) {
    this.uploadService.control({ action: 'upload', uploadId });
  }

  /**
   * Upload all queued Files
   */
  public uploadAll() {
    if (this.IsStateToUpload() === true) {
      this.uploadService.control({ action: 'upload' });
    }
  }

  /**
   * Validiert das Upload Control
   * @param c Control das validiert werden soll
   */
  public validateData(c: AbstractControl): ValidationErrors | null {
    let error: ValidationErrors | null = null;

    if (this.isrequired) {
      error = Validation.required(
        this.validationmessagerequired,
        this.validationmessagesummaryrequired
      )(c);
    }

    return error;
  }

  // #endregion Public Methods

  // #region Public Abstract Methods

  /**
   * Methode kann für Controls verwendet werden, zusätzliche Validierungen bei hinzufügen der Files zu machen
   *
   * @param file File das hinzugefügt wurde.
   * @returns Valdierung ist erfolgreich
   */
  public abstract CustomAddValidation(file: UploadState): boolean;
  /**
   * Methode welche die Upload ID's in das Model setzt oder löscht
   *
   * @param file Type von File ID's
   */
  public abstract SetUploadValue(file: UploadState): void;

  // #endregion Public Abstract Methods

  // #region Private Methods

  private UpdateFileCount(): void {
    // HACK: Add addition property to FormControl. Can be fixed if solution for ticket: https://github.com/angular/angular/issues/19686
    if (this.ngControl) {
      (this.ngControl as unknown as IUploadControl).uploadedfilecount =
        this.UploadedFileCount();
    }
  }

  /**
   * Returns the number of uploaded files
   */
  private UploadedFileCount(): number {
    return this.uploads.filter((itm) => itm.status === 'complete').length;
  }

  /**
   * Prüft ob die Dateierweiterung gültig ist
   *
   * @param filename Dateiname
   */
  private isExtensionValid(filename: string): boolean {
    if (this._allowedtypes === '*') {
      return true;
    }

    let isValid: boolean = false;
    const extensions: string[] = this._allowedtypes.split(',');

    extensions.forEach((itm) => {
      if (filename.toLowerCase().endsWith(itm.toLowerCase())) {
        isValid = true;
      }
    });

    return isValid;
  }

  /**
   * Prüft ob das File nicht zu gross ist.
   *
   * @param filesize Max File Size in Bytes
   */
  private isFileSizeValid(filesize: number): boolean {
    if (this.maxfilesize === 0) {
      return true;
    }

    return this.maxfilesize >= filesize;
  }

  /**
   * Setzt die erlaubten Datentypen für den Upload
   *
   * @param types Erlaubte File Extensions
   */
  private setAllowedTypes(types: string) {
    // Prüfen UploadInput bereits geladen, ist NULL wenn Extension im Markup nach NgModel gesetzt wird.
    if (this.uploadInput && this.uploadInput.nativeElement) {
      this.renderer.setAttribute(
        this.uploadInput.nativeElement,
        'accept',
        types
      );
    }

    this.options.allowedTypes = types;
  }

  /**
   * Setzt den Upload Endpoit
   * @param url Register URI
   */
  private setEndpoint(url: string) {
    this.options.endpoint = url;
  }

  // #endregion Private Methods
}

/**
 * Klasse für den Upload einer Datei in der Upload Component
 */
export class SacUploadFile {
  // #region Properties

  /**
   * Document ID
   */
  public documentid: string;
  /**
   * Dateiname
   */
  public name: string;
  /**
   * Upload Fortschritt
   */
  public progress: number;
  /**
   * Upload Status
   */
  public status: string;
  /**
   * Upload ID
   */
  public uploadId: string;

  // #endregion Properties

  // #region Constructors

  /**
   * Konstruktor
   * @param ufile Upload Status
   */
  constructor(ufile: UploadState) {
    this.uploadId = ufile.uploadId;
    this.name = ufile.name;
    this.progress = ufile.progress;
    this.status = ufile.status;
    this.documentid = null;
  }

  // #endregion Constructors
}

// #endregion Classes
