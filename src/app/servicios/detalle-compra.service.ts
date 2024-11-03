import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleCompraService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/DetalleCompraControlador.php';

  constructor(private http: HttpClient) { }

  consultarDetallesCompra() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarDetalleCompra(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarDetalleCompra(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarDetalleCompra(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarDetalleCompra(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }

  buscarDetallesCompraPorId(id:number) {
    return this.http.get(`${this.url}?control=buscarid&id=${id}`);
  }
}
