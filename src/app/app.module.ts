import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InitFullnamePipe } from './pipes';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MaterialModule } from './module';

import {
  HomepageComponent,
  VerifyComponent,
  AuthComponent,
  NotfoundComponent,
  RegisterComponent,
  RecoveryComponent,
  SettingsComponent,
  CreatePostComponent,
  PostComponent,
} from './views';
import { HeaderComponent, FooterComponent } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundComponent,
    AuthComponent,
    VerifyComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    SettingsComponent,
    RecoveryComponent,
    InitFullnamePipe,
    CreatePostComponent,
    PostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
