import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // Importación de tus environments

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // 👈 Aquí usamos tu variable exacta del environment
  private apiUrl = environment.urlUser; 

  constructor() { }

  // 1. Obtener todos los usuarios desde Spring Boot
  async obtenerUsuarios(): Promise<any[]> {
    try {
      // Forzamos explícitamente el uso de environment.urlUser (http://localhost:7575/usuario)
      console.log('Llamando a la URL de usuarios:', this.apiUrl);
      
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return await response.json();
    } catch (error) {
      console.error('Error crítico en obtenerUsuarios:', error);
      return [];
    }
  }

  // 2. Registrar un nuevo usuario
  async crearUsuario(usuario: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      return await response.text();
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  // 3. Modificar datos de un usuario existente
  async editarUsuario(usuario: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      return await response.text();
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }

  // 4. Eliminar un usuario de la BD
  async eliminarUsuario(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/eliminar/${id}`, {
        method: 'DELETE'
      });
      return await response.text();
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }
}