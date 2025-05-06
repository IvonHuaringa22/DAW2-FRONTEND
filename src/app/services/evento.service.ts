import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private url = 'http://localhost:8080/api/evento';

  constructor(private http: HttpClient) {}

  listarEvento(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }

  obtenerEventoPorId(id : number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${id}`);
  }

  registrarEvento(request : any): Observable<any[]>{
    return this.http.post<any>(this.url, request);
  }

  actualizarEvento(id : number, request : any): Observable<any[]>{
    return this.http.put<any[]>(`${this.url}/${id}`, request);
  }

  eliminarEvento(id : number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.url}/${id}`);
  }
}
