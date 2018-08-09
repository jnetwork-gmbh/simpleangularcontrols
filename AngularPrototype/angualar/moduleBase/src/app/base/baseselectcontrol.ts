import { Input } from '@angular/core';
import { NgBaseListControl } from '../base/baselistcontrol';

export class NgBaseSelectControl extends NgBaseListControl {

  // Definiert das Label für das Group Element
  @Input("grouplabel") _fieldGroupLabel: string = 'label';
  // Definiert die Collection der Items im Group Element
  @Input("groupitems") _fieldGroupItems: string = '';

}
