import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/ProveedorControlador.php';

  constructor(private http: HttpClient) { }

  consultarProveedores() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarProveedor(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarProveedor(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarProveedor(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarProveedor(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
