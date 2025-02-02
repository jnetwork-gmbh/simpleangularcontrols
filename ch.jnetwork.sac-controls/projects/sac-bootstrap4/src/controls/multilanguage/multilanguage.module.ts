import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SACBootstrap4LayoutModule } from '../layout/layout.module';
import { SACBootstrap4TooltipModule } from '../tooltip/tooltip.module';
import { SacMultilanguageInputComponent } from './multilanguageinput';
import { SacMultilanguageInputAreaComponent } from './multilanguageinputarea';
import { SacMultilanguagemenuComponent } from './multilanguagemenu';
import { SacMultilanguagemenuAnchorDirective } from './multilanguagemenuanchor';
import { SacMultilanguagemenuContainerDirective } from './multilanguagemenucontainer';
import { SacMultilanguagemenuItemButtonComponent } from './multilanguagemenuitembutton';

@NgModule({
  declarations: [
    SacMultilanguageInputComponent,
    SacMultilanguageInputAreaComponent,
    SacMultilanguagemenuComponent,
    SacMultilanguagemenuAnchorDirective,
    SacMultilanguagemenuContainerDirective,
    SacMultilanguagemenuItemButtonComponent,
  ],
  imports: [
    CommonModule,
    SACBootstrap4LayoutModule,
    SACBootstrap4TooltipModule,
  ],
  exports: [SacMultilanguageInputComponent, SacMultilanguageInputAreaComponent],
})
export class SACBootstrap4MultilanguageModule {}
