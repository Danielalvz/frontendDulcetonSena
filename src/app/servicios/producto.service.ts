import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../modulos/producto/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url = 'https://backenddulcetonsena-production.up.railway.app/controlador/ProductoControlador.php';

  constructor(private http: HttpClient) { }

  consultarProductos() {
    return this.http.get(`${this.url}?control=listar`);
  }

  eliminarProducto(id:number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`)
  }

  insertarProducto(params:any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params))
  }

  editarProducto(id:number, producto: Producto) {
    return this.http.put(`${this.url}?control=editar&id=${id}`, JSON.stringify(producto))
  }

  buscarProducto(dato:any) {
    return this.http.get(`${this.url}?control=buscar&dato=${dato}`);
  }
}
