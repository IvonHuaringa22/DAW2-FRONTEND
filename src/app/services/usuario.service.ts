import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  listarUsuario(): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.get<any[]>(this.url,{ headers });
  }

  obtenerUsuarioPorId(id : number): Observable<any[]> {
    const headers = this.obtenerHeaders();
    return this.http.get<any[]>(`${this.url}/${id}`, { headers });
  }

  registrarUsuario(request : any): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.post<any>(this.url, request, { headers });
  }

  actualizarUsuario(id : number, request : any): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.put<any[]>(`${this.url}/${id}`, request, { headers });
  }

  eliminarUsuario(id : number): Observable<any[]> {
    const headers = this.obtenerHeaders();
    return this.http.delete<any[]>(`${this.url}/${id}`, { headers });
  }

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }
}
