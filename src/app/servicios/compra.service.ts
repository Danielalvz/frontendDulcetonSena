import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/CompraControlador.php';

  constructor(private http: HttpClient) { }

  consultarCompras() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarCompra(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarCompra(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarCompra(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarCompra(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }

  buscarCompraPorId(id:number) {
    return this.http.get(`${this.url}?control=buscarid&id=${id}`);
  }
}
