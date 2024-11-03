import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/VentaControlador.php';

  constructor(private http: HttpClient) { }

  consultarVentas() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarVenta(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarVenta(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarVenta(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarVenta(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
