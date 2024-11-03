import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/DetalleVentaControlador.php';

  constructor(private http: HttpClient) { }

  consultarDetallesVenta() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarDetalleVenta(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarDetalleVenta(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarDetalleVenta(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarDetalleVenta(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }

  buscarDetallesVentaPorId(id: number) {
    return this.http.get(`${this.url}?control=buscarid&id=${id}`);
  }
}
