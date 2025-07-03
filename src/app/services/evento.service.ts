import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private url = 'http://localhost:8080/api/evento';

  constructor(private http: HttpClient) {}

  listarEvento(): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.get<any[]>(this.url,{ headers });
  }

  obtenerEventoPorId(id : number): Observable<any[]> {
    const headers = this.obtenerHeaders();
    return this.http.get<any[]>(`${this.url}/${id}`,{ headers });
  }

  registrarEvento(request : any): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.post<any>(this.url, request,{ headers });
  }

  actualizarEvento(id : number, request : any): Observable<any[]>{
    const headers = this.obtenerHeaders();
    return this.http.put<any[]>(`${this.url}/${id}`, request,{ headers });
  }

  eliminarEvento(id : number): Observable<any[]> {
    const headers = this.obtenerHeaders();
    return this.http.delete<any[]>(`${this.url}/${id}`,{ headers });
  }

  listarDisponibles(): Observable<any[]> {
  const headers = this.obtenerHeaders();
  return this.http.get<any[]>(`${this.url}/listarDisponibles`, { headers });
  }

  private obtenerHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders().set('Authorization', 'Bearer ' + token);
}

}
