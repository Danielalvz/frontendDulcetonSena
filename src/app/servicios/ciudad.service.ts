import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/CiudadControlador.php';

  constructor(private http: HttpClient) { }

  consultarCiudades() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarCiudad(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarCiudad(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarCiudad(id:number, params:any) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(params))
  }

  buscarCiudad(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
