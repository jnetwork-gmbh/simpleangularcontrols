import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SACBootstrap5LayoutModule } from '../layout/layout.module';
import { SACBootstrap5TooltipModule } from '../tooltip/tooltip.module';
import { SacStaticFormContainerComponent } from './formcontainer';
import { SacStaticLabelComponent } from './staticlabel';

@NgModule({
  declarations: [SacStaticLabelComponent, SacStaticFormContainerComponent],
  imports: [
    CommonModule,
    SACBootstrap5LayoutModule,
    SACBootstrap5TooltipModule,
  ],
  exports: [SacStaticLabelComponent, SacStaticFormContainerComponent],
})
export class SACBootstrap5StaticLabelModule {}
