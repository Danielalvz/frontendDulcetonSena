import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/CategoriaControlador.php';
  
  constructor(private http: HttpClient) {}

  consultarCategorias() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarCategoria(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarCategoria(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarCategoria(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarCategoria(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
