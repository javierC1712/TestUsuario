import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  private http = inject(HttpClient);

  // Obtener
  async obtenerJuegos() {
    return await lastValueFrom(this.http.get<any>(environment.urlJuegos));
  }

  // Agregar
  async crearJuego(juegoNuevo: bodyAgregarJuego) {
    return await lastValueFrom(this.http.post<any>(environment.urlJuegos, juegoNuevo));
  }

  // Editar
  async editarJuego(juegoEditado: bodyEditarJuego) {
    return await lastValueFrom(this.http.put<any>(environment.urlJuegos, juegoEditado));
  }

  // Buscar por ID
  async obtenerJuegoPorId(idJuego: number) {
    return await lastValueFrom(this.http.get<any>(`${environment.urlJuegos}/${idJuego}`));
  }

  // Eliminar juegos
  async eliminarJuego(idJuego: number) {
    return await lastValueFrom(this.http.delete<any>(`${environment.urlJuegos}/${idJuego}`));
  }
}

// interfaces de agregar y editar

interface bodyAgregarJuego {
  nombre: string;
  tipo: string;
  proveedor: string;
  estado: string;
}

interface bodyEditarJuego {
  id_usuario: number;
  nombre: string;
  tipo: string;
  proveedor: string;
  estado: string;
}
