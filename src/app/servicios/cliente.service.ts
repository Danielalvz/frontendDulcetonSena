import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/ClienteControlador.php';

  constructor(private http: HttpClient) { }

  consultarClientes() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarCliente(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarCliente(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarCliente(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarCliente(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
