import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EventoComponent } from './components/evento/evento.component';
import { ZonaComponent } from './zona/zona.component';
import { TicketComponent } from './ticket/ticket.component';
import { CompraComponent } from './components/compra/compra.component';

export const appRoutes: Routes = [
  { path: '', component: UsuarioComponent }, // Redirige a 'Usuario' por defecto
  { path: 'Usuario', component: UsuarioComponent },
  { path: 'Evento', component: EventoComponent },
  { path: 'Zonas', component: ZonaComponent },
  { path: 'Tickets', component: TicketComponent },
  { path: 'Compras', component: CompraComponent },
];