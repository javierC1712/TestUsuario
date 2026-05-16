import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 
import { UsuarioService } from '../../services/usuario-service'; 

@Component({
  selector: 'app-ver-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-component.html', 
  styleUrls: ['./usuarios-component.scss']   
})
export class VerUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  errorMessage: string = '';

  constructor(private userService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (err) => {
        console.error('Error al conectar con user-service:', err);
        this.errorMessage = 'Hubo un problema al conectar con el microservicio de usuarios. Verifica que el backend esté corriendo en el puerto 7575.';
      }
    );
  }
}