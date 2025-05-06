import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  listarUsuario(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }

  obtenerUsuarioPorId(id : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${id}`);
  }

  registrarUsuario(request : any): Observable<any[]>{
    return this.http.post<any>(this.url, request);
  }

  actualizarUsuario(id : number, request : any): Observable<any[]>{
    return this.http.put<any[]>(`${this.url}/${id}`, request);
  }

  eliminarUsuario(id : number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.url}/${id}`);
  }
}
