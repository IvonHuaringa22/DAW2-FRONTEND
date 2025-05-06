import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  correo = '';
  contrasenia = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.correo, this.contrasenia).subscribe({
      next: (data: any) => {
        // Suponiendo que el backend devuelve los datos del usuario, incluido el rol
        this.auth.guardarSesion(data.rol);
        this.router.navigate(['/menu']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
