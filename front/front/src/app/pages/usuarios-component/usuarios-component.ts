import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuario-service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-component.html',
  styleUrls: ['./usuarios-component.scss']
})
export class UsuariosComponent implements OnInit {

  // Listas de datos
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  rolesUnicos: string[] = ['ADMIN', 'JUGADOR', 'USER'];

  // Estados de carga y contadores exigidos por el HTML
  cargando: boolean = true;
  totalActivos: number = 0;
  totalAdmins: number = 0; // 👈 ¡Arregla el error de totalAdmins!

  // Variables de Filtros y Búsqueda exigidas por los [(ngModel)]
  busqueda: string = '';
  filtroEstado: string = '';
  filtroRol: string = '';

  // Control de Modales y objetos de formularios
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;
  
  usuarioSeleccionado: any = null;
  nuevoUsuario: any = {
    username: '',
    email: '',
    Password: '',
    rol: 'JUGADOR',
    estado: 'ACTIVO'
  };

  constructor(
    private _usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  // Cargar lista desde el Microservicio
  async cargarUsuarios() {
    this.cargando = true;
    try {
      const data = await this._usuariosService.obtenerUsuarios();
      this.usuarios = data || [];
      this.filtrarUsuarios(); // Aplica filtros iniciales
    } catch (error) {
      console.error('Error al mapear usuarios:', error);
      this.usuarios = [];
      this.usuariosFiltrados = [];
    } finally {
      this.cargando = false; 
      this.cdr.detectChanges(); 
    }
  }

  // Función lógica para buscar y filtrar en tiempo real
  filtrarUsuarios() {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const cumpleBusqueda = !this.busqueda || 
        (u.nombre && u.nombre.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (u.username && u.username.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(this.busqueda.toLowerCase()));

      const cumpleRol = !this.filtroRol || u.rol === this.filtroRol;
      const cumpleEstado = !this.filtroEstado || u.estado === this.filtroEstado;

      return cumpleBusqueda && cumpleRol && cumpleEstado;
    });

    // Calcular contadores estadísticos para el HTML
    this.totalActivos = this.usuarios.length;
    this.totalAdmins = this.usuarios.filter(u => u.rol === 'ADMIN').length;
    this.cdr.detectChanges();
  }

  // Rutinas para escuchar cambios de búsqueda en el input
  buscar(event: any) {
    this.busqueda = event.target.value;
    this.filtrarUsuarios();
  }

  // --- CONTROL DE MODALES (Gestión / Detalles) ---
  abrirDetalle(usuario: any) {
    // Clonamos el objeto para no editar directamente sobre la tabla
    this.usuarioSeleccionado = { ...usuario }; 
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
    this.cdr.detectChanges();
  }

  // --- CONTROL DE MODALES (Crear) ---
  abrirModalCrear() {
    this.nuevoUsuario = { username: '', email: '', Password: '', rol: 'JUGADOR', estado: 'ACTIVO' };
    this.mostrarModalCrear = true;
    this.cdr.detectChanges();
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
    this.cdr.detectChanges();
  }

  // --- OPERACIONES CRUD ASÍNCRONAS ---
  async crear() {
    try {
      this.cargando = true;
      await this._usuariosService.crearUsuario(this.nuevoUsuario);
      this.cerrarModalCrear();
      await this.cargarUsuarios(); // Recargar grilla
    } catch (error) {
      console.error(error);
    }
  }

  async editar() {
    try {
      this.cargando = true;
      await this._usuariosService.editarUsuario(this.usuarioSeleccionado);
      this.cerrarModal();
      await this.cargarUsuarios();
    } catch (error) {
      console.error(error);
    }
  }

  async eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        this.cargando = true;
        await this._usuariosService.eliminarUsuario(id);
        this.cerrarModal();
        await this.cargarUsuarios();
      } catch (error) {
        console.error(error);
      }
    }
  }
}