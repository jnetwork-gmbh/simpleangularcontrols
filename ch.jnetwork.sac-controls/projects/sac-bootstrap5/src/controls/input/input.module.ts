import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SACBootstrap5LayoutModule } from '../layout/layout.module';
import { SACBootstrap5TooltipModule } from '../tooltip/tooltip.module';
import { SacInputComponent } from './input';
import { SacInputAreaComponent } from './inputarea';
import { SacInputCurrencyComponent } from './inputcurrency';
import { SacInputDecimalComponent } from './inputdecimal';
import { SacInputEmailComponent } from './inputemail';
import { SacInputIntegerComponent } from './inputinteger';
import { SacInputPasswordComponent } from './inputpassword';
import { SacInputSearchComponent } from './inputsearch';

@NgModule({
  declarations: [
    SacInputComponent,
    SacInputAreaComponent,
    SacInputCurrencyComponent,
    SacInputDecimalComponent,
    SacInputEmailComponent,
    SacInputIntegerComponent,
    SacInputPasswordComponent,
    SacInputSearchComponent,
  ],
  imports: [
    CommonModule,
    SACBootstrap5LayoutModule,
    SACBootstrap5TooltipModule,
  ],
  exports: [
    SacInputComponent,
    SacInputAreaComponent,
    SacInputCurrencyComponent,
    SacInputDecimalComponent,
    SacInputEmailComponent,
    SacInputIntegerComponent,
    SacInputPasswordComponent,
    SacInputSearchComponent,
  ],
})
export class SACBootstrap5InputModule {}
