import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EventoComponent } from './components/evento/evento.component';

export const appRoutes: Routes = [
  { path: '', component: UsuarioComponent }, // Redirige a 'Usuario' por defecto
  { path: 'Usuario', component: UsuarioComponent },
  { path: 'Evento', component: EventoComponent },
];