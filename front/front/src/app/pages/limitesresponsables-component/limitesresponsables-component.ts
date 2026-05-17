import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Añadido ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LimitesService } from '../../services/limitesresponsables-service';

@Component({
  selector: 'app-limites-responsables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './limitesresponsables-component.html',
  styleUrls: ['./limitesresponsables-component.scss']
})
export class LimitesResponsablesComponent implements OnInit {

  limites: any[] = [];
  limitesFiltrados: any[] = [];
  cargando: boolean = true;
  busqueda: string = '';
  mostrarModal: boolean = false;
  mostrarModalCrear: boolean = false;
  limiteSeleccionado: any = null;

  nuevoLimite = {
    usuariosIdUsuario: null,
    limiteDiario: 0,
    limiteMensual: 0,
    montoApostadoDiario: 0,
    montoApostadoMensual: 0
  };

  // 👈 Inyectamos el cdr en el constructor
  constructor(
    private _limitesService: LimitesService,
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    await this.cargarLimites();
  }

  async cargarLimites() {
    this.cargando = true;
    try {
      console.log('Enviando petición fetch al microservicio de límites...');
      const data = await this._limitesService.obtenerLimites();
      
      console.log('Datos brutos recibidos desde el Backend:', data);
      
      this.limites = data || [];
      this.limitesFiltrados = data || [];
      
    } catch (error) {
      console.error('Error crítico al conectar el componente con el servicio:', error);
      this.limites = [];
      this.limitesFiltrados = [];
    } finally {
      this.cargando = false;
      console.log('Proceso de carga finalizado en el Front. Cargando =', this.cargando);
      
      // 👈 ¡ESTA LÍNEA ES LA MAGIA! Fuerza a Angular a redibujar la pantalla ahora ya
      this.cdr.detectChanges(); 
    }
  }

  filtrar() {
    if (!this.busqueda) {
      this.limitesFiltrados = this.limites;
    } else {
      this.limitesFiltrados = this.limites.filter(l => 
        l.usuariosIdUsuario?.toString().includes(this.busqueda)
      );
    }
    this.cdr.detectChanges(); // También forzamos el refresco al buscar
  }

  abrirModalCrear() { this.mostrarModalCrear = true; this.cdr.detectChanges(); }
  cerrarModalCrear() { 
    this.mostrarModalCrear = false; 
    this.nuevoLimite = { usuariosIdUsuario: null, limiteDiario: 0, limiteMensual: 0, montoApostadoDiario: 0, montoApostadoMensual: 0 };
    this.cdr.detectChanges(); 
  }

  async crear() {
    if (!this.nuevoLimite.usuariosIdUsuario) { alert('Por favor, digita el ID del usuario.'); return; }
    const res = await this._limitesService.crearLimite(this.nuevoLimite);
    alert(res);
    this.cerrarModalCrear();
    await this.cargarLimites();
  }

  abrirDetalle(limite: any) { this.limiteSeleccionado = { ...limite }; this.mostrarModal = true; this.cdr.detectChanges(); }
  cerrarModal() { this.mostrarModal = false; this.limiteSeleccionado = null; this.cdr.detectChanges(); }

  async editar() {
    const res = await this._limitesService.actualizarLimite(this.limiteSeleccionado);
    alert(res);
    this.cerrarModal();
    await this.cargarLimites();
  }

  async eliminar(id: number) {
    if (confirm('¿Estás seguro?')) {
      const res = await this._limitesService.eliminarLimite(id);
      alert(res);
      this.cerrarModal();
      await this.cargarLimites();
    }
  }
}