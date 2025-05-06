// sesion/auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  login(correo: string, contrasenia: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${correo}:${contrasenia}`)
    });
    return this.http.get(`${this.apiUrl}/api/usuario/loguear`, { headers });
  }

  // Guarda el rol en localStorage (simple ejemplo)
  guardarSesion(rol: string) {
    localStorage.setItem('rol', rol);
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  cerrarSesion() {
    localStorage.clear();
  }
}
//Hola
