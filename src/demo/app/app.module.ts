import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthModule } from '../../lib/module/auth.module';
import { PlexModule } from '@andes/plex';
import { Plex } from '@andes/plex';
import { Server } from '@andes/shared';
import { routing, appRoutingProviders } from './app.routing';


// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
 declarations: [
   AppComponent,
   HomeComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   routing,
   AuthModule,
   PlexModule
 ],
 providers: [
   appRoutingProviders,
   Plex,
   Server
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }
