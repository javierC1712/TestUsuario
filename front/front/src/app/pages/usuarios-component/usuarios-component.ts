import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuario-service';

export interface Usuario {
  id_usuario: number;
  username: string;
  email: string;
  Password_hash: string;
  estado: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-component.html',
  styleUrl: './usuarios-component.scss',
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios: Usuario[] = [];
  cargando: boolean = true;
  filtroEstado: string = 'todos';
  filtroRol: string = 'todos';
  busqueda: string = '';

  usuarioSeleccionado: Usuario | null = null;
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;

  nuevoUsuario = {
    username: '',
    email: '',
    Password_hash: '',
    estado: 'activo',
    rol: 'jugador',
  };

  get usuariosFiltrados(): Usuario[] {
    return this.usuarios.filter(u => {
      const coincideEstado = this.filtroEstado === 'todos' || u.estado === this.filtroEstado;
      const coincideRol = this.filtroRol === 'todos' || u.rol === this.filtroRol;
      const coincideBusqueda =
        this.busqueda === '' ||
        u.username.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideEstado && coincideRol && coincideBusqueda;
    });
  }

  get rolesUnicos(): string[] {
    return [...new Set(this.usuarios.map(u => u.rol))];
  }

  get totalActivos(): number {
    return this.usuarios.filter(u => u.estado === 'activo').length;
  }

  get totalAdmins(): number {
    return this.usuarios.filter(u => u.rol === 'admin').length;
  }

  abrirDetalle(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  abrirModalCrear(): void {
    this.nuevoUsuario = { username: '', email: '', Password_hash: '', estado: 'activo', rol: 'jugador' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  async crear(): Promise<void> {
    try {
      const creado = await this.usuariosService.crearUsuario(this.nuevoUsuario);
      this.usuarios.push(creado);
      this.cerrarModalCrear();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }

  async editar(): Promise<void> {
    if (!this.usuarioSeleccionado) return;
    try {
      await this.usuariosService.editarUsuario(this.usuarioSeleccionado);
      const idx = this.usuarios.findIndex(u => u.id_usuario === this.usuarioSeleccionado!.id_usuario);
      if (idx !== -1) this.usuarios[idx] = { ...this.usuarioSeleccionado };
      this.cerrarModal();
    } catch (error) {
      console.error('Error al editar usuario:', error);
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.usuariosService.eliminarUsuario(id);
      this.usuarios = this.usuarios.filter(u => u.id_usuario !== id);
      this.cerrarModal();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  async ngOnInit() {
    try {
      this.usuarios = await this.usuariosService.obtenerUsuarios();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      this.cargando = false;
    }
  }
}
