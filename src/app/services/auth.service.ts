// sesion/auth.service.ts
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/login';

  constructor(
    private http: HttpClient
  ) {}

    login(correo: string, contrasenia: string): Observable<any> {
    const credenciales = {
      correo: correo,
      contrasenia: contrasenia
    };

    return this.http.post(this.apiUrl, credenciales, {
      observe: 'response'
    }).pipe(map((response: HttpResponse<any>) => {
      const headers = response.headers;
      const body = response.body;

      const bearerToken = headers.get('Authorization');
      const token = bearerToken ? bearerToken.replace('Bearer ', '') : null;

      if (token) {
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol || null;
        const correoPayload = payload.sub || payload.correo || null;

        if (rol) {
          localStorage.setItem('rol', rol);
        }
        if (correoPayload) {
        localStorage.setItem('correo', correoPayload); // ✅ Aquí lo guardas
        }
      } else {
        console.error('Token no recibido');
      }

      return body;
    }));
  }

  // Guarda el rol en localStorage
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}

