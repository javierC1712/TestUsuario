import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JuegosService {
  private http = inject(HttpClient);

  async obtenerJuegos() {
    return await lastValueFrom(this.http.get<any>(environment.urlJuegos));
  }
}
