import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  // Recuerda tener mapeado urlJuegos en tus environments (ej: http://localhost:7575/juegos)
  private apiUrl = environment.urlJuegos;

  constructor() { }

  // 1. Obtener todos los juegos (Mapea al @GetMapping del Controlador)
  async obtenerJuegos(): Promise<any[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error al conectar con el microservicio de juegos');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerJuegos:', error);
      return [];
    }
  }

  // 2. Crear un nuevo juego (Mapea al @PostMapping("/crear"))
  async crearJuego(juego: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(juego)
      });
      if (!response.ok) throw new Error('Error al crear el juego');
      return await response.json();
    } catch (error) {
      console.error('Error en crearJuego:', error);
      return null;
    }
  }

  // 3. Actualizar datos de un juego (Mapea al @PutMapping("/actualizar"))
  async actualizarJuego(juego: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(juego)
      });
      if (!response.ok) throw new Error('Error al actualizar el juego');
      return await response.json();
    } catch (error) {
      console.error('Error en actualizarJuego:', error);
      return null;
    }
  }

  // 4. Eliminar un juego (Mapea al @DeleteMapping("/eliminar/{id}"))
  async eliminarJuego(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/eliminar/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error en eliminarJuego:', error);
      return false;
    }
  }
}