import { Routes } from '@angular/router';
import { VerJuegosComponent } from './pages/ver-juegos-component/ver-juegos-component';
import { VerUsuariosComponent } from './pages/usuarios-component/usuarios-component';

export const routes: Routes = [
  { 
    path: 'juegos', 
    component: VerJuegosComponent 
  },
  { 
    path: 'usuarios', 
    component: VerUsuariosComponent 
  },
];