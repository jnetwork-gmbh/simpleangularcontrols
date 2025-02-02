import { HttpClient } from '@angular/common/http';
import { Component, Injector, ViewChild } from '@angular/core';
import {
  IBrowserFile,
  IBrowserNode,
  SacFileBrowserCommon,
} from '@simpleangularcontrols/sac-common';
import { Observable, forkJoin } from 'rxjs';
import { ServiceConfirm } from '../../controls/confirm/confirm.service';
import { SacDropzoneMultipleComponent } from '../../controls/upload/dropzonemultiple';

/**
 * Server File Browser Komponente
 */
@Component({
  selector: 'sac-filebrowser',
  templateUrl: './browser.html',
  providers: [ServiceConfirm],
})
export class SacBrowserComponent extends SacFileBrowserCommon {
  // #region Properties

  /**
   * Referenz auf Upload Component
   */
  @ViewChild(SacDropzoneMultipleComponent, { static: false })
  private uploadComponent: SacDropzoneMultipleComponent;

  // #endregion Properties

  // #region Constructors

  /**
   * Konstruktor
   * @param httpClient HTTP Client
   * @param injector Angular Dependency Injection Service
   * @param confirmService Confirm Service
   */
  constructor(
    httpClient: HttpClient,
    injector: Injector,
    private confirmService: ServiceConfirm
  ) {
    super(httpClient, injector);
  }

  // #endregion Constructors

  // #region Public Methods

  /**
   * Confirm Action wenn ein File gelöscht werden soll
   * @param file File das gelöscht werden soll.
   * @returns Observable ob File gelöscht werden kann.
   */
  public confirmDeleteFile(file: IBrowserFile): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      forkJoin({
        title: this.lngResourceService.GetString(
          this.validationKeyService.FilebrowserButtonDelete
        ),
        message: this.lngResourceService.GetString(
          this.validationKeyService.FilebrowserConfirmTextDeleteFile
        ),
      }).subscribe((text) => {
        this.confirmService
          .ConfirmMessage(text.title, text.message)
          .subscribe((result) => {
            if (result === 'yes') {
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          });
      });
    });
  }

  /**
   * Confirm Action wenn ein Ordner gelöscht werden soll
   * @param node Ordner der gelöscht werden soll
   * @returns Observable ob Ordner gelöscht kann.
   */
  public confirmDeleteNode(node: IBrowserNode): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      forkJoin({
        title: this.lngResourceService.GetString(
          this.validationKeyService.FilebrowserButtonDelete
        ),
        message: this.lngResourceService.GetString(
          this.validationKeyService.FilebrowserConfirmTextDeleteFolder
        ),
      }).subscribe((text) => {
        this.confirmService
          .ConfirmMessage(text.title, text.message)
          .subscribe((result) => {
            if (result === 'yes') {
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          });
      });
    });
  }

  /**
   * Erzeugt ein Array von einer bestimmten grösse
   * @param anzahl Grösse des Array
   * @returns Array
   */
  public count(anzahl: number): Array<void> {
    return new Array(anzahl);
  }

  /**
   * Methode wird aufgerufen, wenn eine Datei verschoben wird
   * @param uploadid Upload ID
   */
  public uploadedFileMoved(uploadid: string): void {
    const item = this.uploadComponent.uploads.find(
      (itm) => itm.documentid === uploadid
    );

    if (item) {
      this.uploadComponent.cancel(item.uploadId);
    }
  }

  // #endregion Public Methods
}
