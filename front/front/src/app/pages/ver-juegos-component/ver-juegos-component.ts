import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos-service';

export interface Juego {
  estado: string;
  id_usuario: number;
  nombre: string;
  proveedor: string;
  tipo: string;
}

@Component({
  selector: 'app-ver-juegos-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-juegos-component.html',
  styleUrl: './ver-juegos-component.scss',
})
export class VerJuegosComponent implements OnInit {
  private juegosService = inject(JuegosService);

  juegos: Juego[] = [];
  cargando: boolean = true;
  filtroActivo: string = 'todos';

  get juegosFiltrados(): Juego[] {
    if (this.filtroActivo === 'todos') return this.juegos;
    return this.juegos.filter((j) => j.tipo.toLowerCase() === this.filtroActivo.toLowerCase());
  }

  get juegosActivos(): number {
    return this.juegos.filter((j) => j.estado === 'activo').length;
  }

  get tiposUnicos(): string[] {
    return [...new Set(this.juegos.map((j) => j.tipo))];
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
  }

  async ngOnInit() {
    try {
      this.juegos = await this.juegosService.obtenerJuegos();
    } catch (error) {
      console.error('Error al cargar los juegos desde el microservicio:', error);
    } finally {
      this.cargando = false;
    }
  }
}
