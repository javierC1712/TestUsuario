import { Routes } from '@angular/router';
import { JuegosComponent } from './pages/ver-juegos-component/ver-juegos-component';
import { UsuariosComponent } from './pages/usuarios-component/usuarios-component';
import { BilleteraComponent } from './pages/billetera-component/billetera-component';
import { LimitesResponsablesComponent } from './pages/limitesresponsables-component/limitesresponsables-component';
import { EventosComponent } from './pages/eventos-component/eventos-component';

export const routes: Routes = [
  {
    path: 'juegos',
    component: JuegosComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'billetera',
    component: BilleteraComponent
  },
  { path: 'limites',
     component: LimitesResponsablesComponent },
  {
    path: 'eventos',
    component: EventosComponent},


];
