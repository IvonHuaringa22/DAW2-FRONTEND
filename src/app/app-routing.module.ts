import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { EventoComponent } from './components/evento/evento.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { appRoutes } from './app.routes';
import { LoginGuard } from './components/helpers/login.guard';
import { CompraComponent } from './components/compra/compra.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'menu', component: MenuComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'eventos', component: EventoComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'compras', component: CompraComponent },
];


// Import the components for the routes
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
