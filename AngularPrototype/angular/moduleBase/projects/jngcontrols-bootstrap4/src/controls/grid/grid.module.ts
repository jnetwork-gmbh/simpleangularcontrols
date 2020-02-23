import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgGridComponent } from './grid';
import { NgGridButtonComponent } from './gridbutton';
import { NgGridColumnComponent } from './gridcolumn';
import { NgGridColumnActionComponent } from './gridcolumnaction';
import { NgGridImageComponent } from './gridimage';
import { NgPagingComponent } from './paging';


@NgModule({
  declarations: [NgGridComponent, NgGridColumnComponent, NgGridColumnActionComponent, NgPagingComponent, NgGridButtonComponent, NgGridImageComponent],
  imports: [
    BrowserModule, FormsModule
  ],
  exports: [NgGridComponent, NgGridColumnComponent, NgGridColumnActionComponent, NgPagingComponent, NgGridButtonComponent, NgGridImageComponent]
})
export class JNetworkBootstrap4GridModule { }

