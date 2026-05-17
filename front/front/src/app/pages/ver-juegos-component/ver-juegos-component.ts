import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 1. Importa esto
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuegosService } from '../../services/juegos-service';

@Component({
  selector: 'app-ver-juegos-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-juegos-component.html',
  styleUrls: ['./ver-juegos-component.scss']
})
export class JuegosComponent implements OnInit {
  
  listaJuegos: any[] = [];
  juegosFiltrados: any[] = [];
  isLoading: boolean = true;
  busqueda: string = '';
  totalJuegos: number = 0;
  juegosActivos: number = 0;

  // 2. Inyéctalo en tu constructor aquí:
  constructor(
    private juegosService: JuegosService,
    private cdr: ChangeDetectorRef 
  ) {}

  async ngOnInit() {
    await this.cargarJuegos();
  }

  async cargarJuegos() {
    this.isLoading = true;
    try {
      const datos = await this.juegosService.obtenerJuegos();
      console.log('Datos recibidos del backend:', datos); // 👈 3. Pon este log para ver si llegan
      
      this.listaJuegos = datos || [];
      this.juegosFiltrados = [...this.listaJuegos];
      this.actualizarContadores();
    } catch (error) {
      console.error('Error al cargar', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // 👈 4. Forzamos a Angular a ocultar el spinner y pintar la tabla
    }
  }

  actualizarContadores() {
    this.totalJuegos = this.listaJuegos.length;
    this.juegosActivos = this.listaJuegos.filter(j => j.estado === 'ACTIVO').length;
  }

  filtrarJuegos() {
    const query = this.busqueda.toLowerCase().trim();
    if (!query) {
      this.juegosFiltrados = [...this.listaJuegos];
    } else {
      this.juegosFiltrados = this.listaJuegos.filter(juego => 
        juego.nombre.toLowerCase().includes(query) || 
        juego.tipo.toLowerCase().includes(query) ||
        juego.proveedor.toLowerCase().includes(query)
      );
    }
  }

  abrirModalCrear() { console.log('Crear'); }
  gestionarJuego(juego: any) { console.log('Gestionar', juego); }
}