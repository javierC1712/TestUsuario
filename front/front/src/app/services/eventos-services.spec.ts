import { TestBed } from '@angular/core/testing';
import { EventosService } from './eventos-services'; // 👈 CORREGIDO: Sin la 's' al final de la clase

describe('EventosService', () => {
  let service: EventosService; // 👈 CORREGIDO

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosService); // 👈 CORREGIDO
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});