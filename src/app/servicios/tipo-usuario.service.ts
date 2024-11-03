import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {

  url = 'http://localhost:8080/dulceton-sena/backend/controlador/TipoUsuarioControlador.php';

  constructor(private http: HttpClient) { }

  consultarTipoUsuarios() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarTipoUsuario(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarTipoUsuario(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarTipoUsuario(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarTipoUsuario(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
