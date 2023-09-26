import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  BrowserAnimationsModule,
  AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideDatabase(() => getDatabase()),
  provideFirestore(() => getFirestore()),
  provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

