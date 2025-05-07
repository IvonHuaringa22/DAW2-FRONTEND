import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  correo = '';
  contrasenia = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.correo, this.contrasenia).subscribe({
      next: (data: any) => {
        // Guardar las credenciales correctamente
        localStorage.setItem('correo', this.correo);
        localStorage.setItem('contrasenia', this.contrasenia);

        // Suponiendo que el backend devuelve los datos del usuario, incluido el rol
        this.auth.guardarSesion(data.rol);
        if (data.rol === 'ADMIN') {
          this.router.navigate(['/menu']);
        } else if (data.rol === 'USER') {
          this.router.navigate(['/eventos']);
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
