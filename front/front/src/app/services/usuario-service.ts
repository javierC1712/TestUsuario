import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);

  // Obtener
  async obtenerUsuarios() {
    return await lastValueFrom(this.http.get<any>(environment.urlUser));
  }

  // Crear
  async crearUsuario(usuarioNuevo: bodyAgregarUsuario) {
    return await lastValueFrom(this.http.post<any>(environment.urlUser, usuarioNuevo));
  }

  // Editar
  async editarUsuario(usuarioEditado: bodyEditarUsuario) {
    return await lastValueFrom(this.http.put<any>(environment.urlUser, usuarioEditado));
  }

  // Buscar
  async obtenerUsuarioPorId(idUsuario: number) {
    return await lastValueFrom(this.http.get<any>(`${environment.urlUser}/${idUsuario}`));
  }

  // Eliminar
  async eliminarUsuario(idUsuario: number) {
    return await lastValueFrom(this.http.delete<any>(`${environment.urlUser}/${idUsuario}`));
  }
}

// Interfaces de agregar y editar

interface bodyAgregarUsuario {
  username: string;
  email: string;
  Password_hash: string;
  estado: string;
  rol: string;
}

interface bodyEditarUsuario {
  id_usuario: number;
  username: string;
  email: string;
  Password_hash: string;
  estado: string;
  rol: string;
}
