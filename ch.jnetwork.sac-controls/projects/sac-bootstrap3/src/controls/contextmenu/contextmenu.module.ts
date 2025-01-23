import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SacContextmenuComponent } from './contextmenu';
import { SacContextmenuAnchorDirective } from './contextmenuanchor';
import { SacContextmenuContainerDirective } from './contextmenucontainer';
import { SacContextmenuItemButtonComponent } from './contextmenuitembutton';
import { SacContextmenuItemSplitterComponent } from './contextmenuitemsplitter';

@NgModule({
  declarations: [
    SacContextmenuComponent,
    SacContextmenuItemButtonComponent,
    SacContextmenuItemSplitterComponent,
    SacContextmenuAnchorDirective,
    SacContextmenuContainerDirective,
  ],
  imports: [CommonModule],
  exports: [
    SacContextmenuComponent,
    SacContextmenuItemButtonComponent,
    SacContextmenuItemSplitterComponent,
    SacContextmenuAnchorDirective,
  ],
})
export class SACBootstrap3ContextmenuModule {}
