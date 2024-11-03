import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  url = 'http://localhost:8080/dulceton-sena/backend/controlador/DepartamentoControlador.php';

  constructor(private http: HttpClient) { }

  consultarDepartamentos() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarDepartamento(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarDepartamento(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarDepartamento(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarDepartamento(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
