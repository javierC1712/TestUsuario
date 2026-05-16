import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:7575/usuarios'; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:7575/usuario'); 
}
} 