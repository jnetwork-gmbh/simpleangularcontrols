import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SacListboxComponent, SacListboxOptionDirective } from './listbox';

@NgModule({
  imports: [CommonModule, SacListboxComponent, SacListboxOptionDirective],
  exports: [SacListboxComponent, SacListboxOptionDirective],
})
export class SACBootstrap4ListModule {}
