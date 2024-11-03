import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/UsuarioControlador.php';

  constructor(private http: HttpClient) { }

  consultarUsuarios() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarUsuario(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarUsuario(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarUsuario(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarUsuario(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
