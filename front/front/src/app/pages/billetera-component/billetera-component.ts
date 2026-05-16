import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <-- 1. Agrega ChangeDetectorRef aquí arriba
import { CommonModule } from '@angular/common';
import { BilleteraService } from '../../services/billetera-service';

export interface Billetera {
  estado: string;
  fecha_creacion: string;
  id_billetera: number;
  id_usuario: number;
  moneda: string;
  saldo: number;
  saldo_bloqueado: number;
}

@Component({
  selector: 'app-billetera-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billetera-component.html',
  styleUrl: './billetera-component.scss',
})
export class BilleteraComponent implements OnInit {
  private billeteraService = inject(BilleteraService);
  private cdr = inject(ChangeDetectorRef); // <-- 2. Inyecta el detector de cambios aquí

  billeteras: Billetera[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todas';
  billeteraSeleccionada: Billetera | null = null;
  mostrarModal: boolean = false;

  get billeterasFiltradas(): Billetera[] {
    if (this.filtroActivo === 'todas') return this.billeteras;
    return this.billeteras.filter(b => b.estado === this.filtroActivo);
  }

  get totalSaldos(): number {
    return this.billeteras
      .filter(b => b.estado === 'activo')
      .reduce((acc, b) => acc + b.saldo, 0);
  }

  get totalBloqueado(): number {
    return this.billeteras.reduce((acc, b) => acc + b.saldo_bloqueado, 0);
  }

  get billeterasActivas(): number {
    return this.billeteras.filter(b => b.estado === 'activo').length;
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
    this.cdr.detectChanges(); // Fuerza el redibujado al cambiar filtros
  }

  abrirDetalle(billetera: Billetera): void {
    this.billeteraSeleccionada = billetera;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.billeteraSeleccionada = null;
    this.cdr.detectChanges();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  eliminar(id: number): void {
    this.billeteraService.eliminarBilletera(id).subscribe({
      next: () => {
        this.billeteras = this.billeteras.filter(b => b.id_billetera !== id);
        this.cerrarModal();
        this.cdr.detectChanges(); // Avisa que se eliminó una card
      },
      error: (error) => {
        console.error('Error al eliminar billetera:', error);
      }
    });
  }

  ngOnInit() {
    console.log('Iniciando la carga de billeteras del casino...');

    this.billeteraService.obtenerBilleteras().subscribe({
      next: (data) => {
        console.log('¡Datos mapeados con éxito en Angular!', data);
        this.billeteras = data || [];
        this.cargando = false;

        this.cdr.detectChanges(); // <-- 3. ¡LA MAGIA! Fuerza a Angular a ocultar el spinner y renderizar las tarjetas
      },
      error: (error) => {
        console.error('Error al conectar con el microservicio:', error);
        this.cargando = false;
        this.cdr.detectChanges(); // También aquí por si falla
      }
    });
  }
}
