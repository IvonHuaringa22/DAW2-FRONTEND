import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { EventoComponent } from './components/evento/evento.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginInterceptor } from './components/helpers/login.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    UsuarioComponent,
    EventoComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule // Add FormsModule to imports
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: LoginInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
