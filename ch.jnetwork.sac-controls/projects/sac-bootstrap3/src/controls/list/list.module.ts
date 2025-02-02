import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SACCommonListboxOptionModule } from '@simpleangularcontrols/sac-common';
import { SACBootstrap3LayoutModule } from '../layout/layout.module';
import { SACBootstrap3TooltipModule } from '../tooltip/tooltip.module';
import { SacDropdownComponent, SacDropdownOptionDirective } from './dropdown';
import { SacListboxComponent } from './listbox';

@NgModule({
  declarations: [
    SacDropdownComponent,
    SacDropdownOptionDirective,
    SacListboxComponent,
  ],
  imports: [
    CommonModule,
    SACCommonListboxOptionModule,
    SACBootstrap3TooltipModule,
    FormsModule,
    SACBootstrap3LayoutModule,
  ],
  exports: [
    SacDropdownComponent,
    SacDropdownOptionDirective,
    SacListboxComponent,
  ],
})
export class SACBootstrap3ListModule {}
