import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private url = 'http://localhost:8080/api/compra';

  constructor(private http: HttpClient) {}

  registrarCompra(dto: any): Observable<any> {
    return this.http.post(this.url, dto, { responseType: 'text' });
  }

  private obtenerHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { headers: this.obtenerHeaders() });
  }

}