import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared-module/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConfirmationDialog } from './shared-component/custom-dialogbox/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent, ConfirmationDialog ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
