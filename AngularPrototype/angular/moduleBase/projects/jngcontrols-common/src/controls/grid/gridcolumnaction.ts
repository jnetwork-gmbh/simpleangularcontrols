import { Input, EventEmitter, Output, TemplateRef, Component, ElementRef } from '@angular/core';
import { NgGridColumnBaseCommon } from './gridcolumnbase';
import { NgGridCommon } from './grid';

/**
 * Komponente für NgGridColumnActionCommon. Extends NgGridColumnBaseCommon 
 */
export class NgGridColumnActionCommon extends NgGridColumnBaseCommon {

  /**
  * Konstruktor
  * @param el Element Referenz
  * @param grid NgGridCommon
  */
  constructor(grid: NgGridCommon, el: ElementRef) {
    super(grid, el);
  }
}
