import { Component } from '@angular/core';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { Producto } from './producto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {

  producto: any;
  categoria: any;
  proveedor: any;
  idProducto: any;

  obj_producto: Producto = {
    codigo: "",
    nombre: "",
    fo_categoria: 0,
    valor_compra: 0,
    valor_venta: 0,
    stock: 0,
    venta_al_publico: null,
    fo_proveedor: 0
  }

  validar_codigo = true;
  validar_nombre = true;
  validar_fo_categoria = true;
  validar_valor_compra = true;
  validar_valor_venta = true;
  validar_stock = true;
  validar_venta_al_publico = true;
  validar_fo_proveedor = true;

  mform = false;
  botonesForm = false;

  constructor(private sproducto: ProductoService, private scategoria: CategoriaService, private sproveedor: ProveedorService) { }

  ngOnInit(): void { //se ejecuta cada vez que cargue el sitio
    this.consulta();
    this.consultarCategoria();
    this.consultarProveedor();
  }

  consulta() {
    this.sproducto.consultarProductos().subscribe((resultado: any) => {
      this.producto = resultado;
    })
  }

  consultarCategoria() {
    this.scategoria.consultarCategorias().subscribe((resultado: any) => {
      this.categoria = resultado;
    })
  }

  consultarProveedor() {
    this.sproveedor.consultarProveedores().subscribe((resultado: any) => {
      this.proveedor = resultado;
    });
  }

  mostrarForm(dato: any) {
    switch (dato) {
      case "ver":
        this.mform = true;
        break;
      case "ocultar":
        this.limpiar();
        this.mform = false;
        this.botonesForm = false;
        this.limpiarMensajesError();
        break;
    }
  }

  limpiar() {
    this.obj_producto = {
      codigo: "",
      nombre: "",
      fo_categoria: 0,
      valor_compra: 0,
      valor_venta: 0,
      stock: 0,
      venta_al_publico: null,
      fo_proveedor: 0
    }
  }

  limpiarMensajesError() {
    this.validar_codigo = true;
    this.validar_nombre = true;
    this.validar_fo_categoria = true;
    this.validar_valor_compra = true;
    this.validar_valor_venta = true;
    this.validar_stock = true;
    this.validar_venta_al_publico = true;
    this.validar_fo_proveedor = true;
  }


  validarProducto(funcion: any) {
    console.log("Valor inicial de venta_al_publico:", this.obj_producto.venta_al_publico); // <-- Agrega aquí para ver el valor inicial

    this.validar_codigo = this.obj_producto.codigo.trim() !== "";

    this.validar_nombre = this.obj_producto.nombre.trim() !== "";

    this.validar_fo_categoria = this.obj_producto.fo_categoria !== 0;

    this.validar_valor_compra = this.obj_producto.valor_compra !== 0 || this.obj_producto.valor_compra > 0;

    this.validar_valor_venta = this.obj_producto.valor_venta !== 0 || this.obj_producto.valor_venta > 0;

    this.validar_stock = this.obj_producto.stock !== 0 || this.obj_producto.stock > 0;

    this.validar_venta_al_publico = this.obj_producto.venta_al_publico !== null;
    console.log("Valor despues de valdiacion venta_al_publico:", this.obj_producto.venta_al_publico);

    this.validar_fo_proveedor = this.obj_producto.fo_proveedor !== 0;

    if (this.validar_codigo && this.validar_fo_categoria && this.validar_fo_proveedor && this.validar_nombre && this.validar_stock && this.validar_valor_compra && this.validar_valor_venta && this.validar_venta_al_publico && funcion == "guardar") {
      this.guardarProducto();
    }

    if (this.validar_codigo && this.validar_fo_categoria && this.validar_fo_proveedor && this.validar_nombre && this.validar_stock && this.validar_valor_compra && this.validar_valor_venta && this.validar_venta_al_publico && funcion == "editar") {
      this.editar();
    }
  }

  guardarProducto() {
    console.log('Valor enviado de venta_al_publico:', this.obj_producto.venta_al_publico);
    this.sproducto.insertarProducto(this.obj_producto).subscribe((datos: any) => {
      console.log('Respuesta del servidor:', datos);
      if (datos.resultado === 'OK') {
        this.consulta();
      } else {
        console.error('Error en la respuesta del servidor:', datos.mensaje);
        alert('Error: ' + datos.mensaje);
      }

    });
    this.limpiar();
    this.mostrarForm("ocultar");
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Está seguro de eliminar este producto?",
      text: "El proceso no podrá ser revertido.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sproducto.eliminarProducto(id).subscribe((datos: any) => {
          if (datos.resultado === 'OK') {
            Swal.fire({
              title: "Eliminado!",
              text: "El producto ha sido eliminado.",
              icon: "success"
            });
            this.consulta();
          } else {
            Swal.fire({
              title: "Error",
              text: datos.mensaje,
              icon: "error"
            });
          }
        });
      }
    });

  }

  cargarDatos(items: any, id: number) {
    this.limpiarMensajesError();

    this.obj_producto = {
      codigo: items.codigo,
      nombre: items.nombre,
      fo_categoria: items.fo_categoria,
      valor_compra: items.valor_compra,
      valor_venta: items.valor_venta,
      stock: items.stock,
      venta_al_publico: items.venta_al_publico !== null ? Number(items.venta_al_publico) : null,
      fo_proveedor: items.fo_proveedor
    }

    this.idProducto = id;
    this.botonesForm = true;
    this.mostrarForm('ver');
  }

  editar() {
    this.sproducto.editarProducto(this.idProducto, this.obj_producto).subscribe((datos: any) => {
      if (datos['resultado'] == "OK") {
        this.consulta();
      }
    });

    this.limpiar();
    this.mostrarForm("ocultar");
  }
}
