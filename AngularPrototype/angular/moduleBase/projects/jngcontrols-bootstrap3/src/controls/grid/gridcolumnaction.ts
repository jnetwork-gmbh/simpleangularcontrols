import { Input, EventEmitter, Output, TemplateRef, Component, forwardRef } from '@angular/core';
import { NgGridColumnActionCommon, NgGridColumnBaseCommon } from '@jnetwork/jngcontrols-common';

@Component({
  selector: 'ngGridColumnAction,[ngGridColumnAction]',
  templateUrl: './gridcolumnaction.html',
  providers: [{ provide: NgGridColumnBaseCommon, useExisting: forwardRef(() => NgGridColumnAction) }]
})
export class NgGridColumnAction extends NgGridColumnActionCommon {

  constructor() {
    super();
    this.width = "18px";
  }

  @Output("onclick")
  clickaction: EventEmitter<any> = new EventEmitter<any>();

  public callaction(parameter: any) {
    console.log("NgGridColumnAction: callaction");
    this.clickaction.emit(parameter);
  }


}
