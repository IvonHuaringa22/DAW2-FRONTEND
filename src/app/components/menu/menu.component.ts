import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  rol: string | null = null;

  constructor(private auth: AuthService,  private router: Router) {}

  ngOnInit(): void {
    this.rol = this.auth.obtenerRol();
  }
  
  irAEventos() {
    this.router.navigate(['/eventos']);
  }

  irAUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  irAZonas() {
  this.router.navigate(['/zonas']);
}

irATickets() {
  this.router.navigate(['/tickets']);
}
irACompras() {
  this.router.navigate(['/compras']);
}

  logout() {
    this.auth.cerrarSesion();
    this.router.navigate(['/login']);
  }
}

