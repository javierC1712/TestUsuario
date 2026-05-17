import { Routes } from '@angular/router';
import { VerJuegosComponent } from './pages/ver-juegos-component/ver-juegos-component';
import { UsuariosComponent } from './pages/usuarios-component/usuarios-component';
import { BilleteraComponent } from './pages/billetera-component/billetera-component';
import { LimitesResponsablesComponent } from './pages/limitesresponsables-component/limitesresponsables-component';

export const routes: Routes = [
  {
    path: 'juegos',
    component: VerJuegosComponent
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
     component: LimitesResponsablesComponent }


];
