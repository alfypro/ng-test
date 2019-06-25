import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { SharedModule } from './shared.module';
import { ServicioService } from './api/servicio.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Loading
import { LoaderComponent } from './modelo/loader/loader.component';

// Variables globales
import { GlobalesService } from './modelo/servicios/globales/globales.service';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    ServicioService,
    GlobalesService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
