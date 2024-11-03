import { Component } from '@angular/core';
import { CompraService } from 'src/app/servicios/compra.service';
import { DetalleCompraService } from 'src/app/servicios/detalle-compra.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent {
  compras: any[] = [];
  detalles: any[] = [];
  proveedores: any[] = [];
  usuarios: any[] = [];
  productos: any[] = [];
  idCompra: any;
  idDetalleCompra: any;

  obj_compras = {
    fecha: '',
    iva: 0,
    fo_proveedor: 0,
    fo_usuario: 0,
    detalles: [] as any[] // Arreglo para los detalles de compra
  };

  nuevoDetalle = {
    producto: "",
    fo_producto: 0,
    cantidad: 0,
    precio: 0
  };

  validar_fecha = true;
  validar_iva = true;
  validar_fo_proveedor = true;
  validar_fo_usuario = true;

  validar_fo_producto = true;
  validar_cantidad = true;
  validar_precio = true;

  mform = false;
  botonesForm = false;
  deshabilitarEdicion = false;
  botonCancelar = false;
  botonGuardarDetalle = false;

  constructor(private scompras: CompraService, private sdetalle: DetalleCompraService, private sproveedor: ProveedorService, private susuario: UsuarioService, private sproducto: ProductoService) { }


  ngOnInit(): void {
    this.consulta();
    this.consultarProveedor();
    this.consultarUsuario();
    this.consultarProductos();
  }

  consulta() {
    this.scompras.consultarCompras().subscribe((compras: any) => {
      this.compras = compras;

      this.sdetalle.consultarDetallesCompra().subscribe((detalles: any) => {
        // this.detalles = detalles;

        this.mapearDetallesACompras(detalles);
      });
    });
  }

  mapearDetallesACompras(detalles: any) {
    console.log("En mapeo");
    console.log(detalles, this.compras);

    console.log("Compras antes de mapear:", this.compras);

    this.compras.forEach((compra: any) => {
      compra.detalles = detalles.filter((detalle: any) => {
        const foComprasNum = Number(detalle.fo_compras);
        const idCompraNum = Number(compra.id_compra);

        return foComprasNum === idCompraNum;
      });

    });
  }

  calcularTotalConIVA(compra: any): number {
    const subtotal = compra?.detalles?.reduce((total: number, detalle: any) => total + (detalle.cantidad * detalle.precio), 0) || 0;
    const iva = (subtotal * compra.iva) / 100;
    return subtotal + iva;
  }

  // Consultas adicionales para insertar compra
  consultarProveedor() {
    this.sproveedor.consultarProveedores().subscribe((resultado: any) => {
      this.proveedores = resultado;
    });
  }

  consultarUsuario() {
    this.susuario.consultarUsuarios().subscribe((resultado: any) => {
      this.usuarios = resultado;
    });
  }

  consultarProductos() {
    this.sproducto.consultarProductos().subscribe((resultado: any) => {
      this.productos = resultado;
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

  agregarDetalle() {
    if (this.nuevoDetalle.fo_producto > 0 && this.nuevoDetalle.cantidad > 0 && this.nuevoDetalle.precio > 0) {
      const productoEncontrado = this.productos.find(prod => prod.id_producto === this.nuevoDetalle.fo_producto);
      if (productoEncontrado) {
        this.nuevoDetalle.producto = productoEncontrado.nombre;
      } else {
        console.error("Producto no encontrado o productos aún no ha cargado.");
      }
      
      if (this.idCompra > 0) {
        this.botonCancelar = false;
        const detalleNuevo = {
          fo_producto: this.nuevoDetalle.fo_producto,
          producto: this.productos.find(prod => prod.id_producto === this.nuevoDetalle.fo_producto)?.nombre,
          cantidad: this.nuevoDetalle.cantidad,
          precio: this.nuevoDetalle.precio,
          fo_compras: this.idCompra
        };

        console.log("DETALLENUEVO", detalleNuevo);

        // Llama al servicio para insertar el detalle en la base de datos
        this.sdetalle.insertarDetalleCompra(detalleNuevo).subscribe({
          next: (respuesta) => {
            console.log("Nuevo detalle agregado a venta existente:", respuesta);

            this.consulta();

            this.obj_compras.detalles.push(respuesta);
            this.consulta();

            this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };

          },
          error: (err) => console.error("Error al agregar detalle:", err)
        });
      } else {
        console.log("Agregando nuevo detalle en modo creación.");
        this.botonCancelar = true;
        console.log(this.nuevoDetalle);
        console.log(this.obj_compras.detalles);

        this.obj_compras.detalles.push({ ...this.nuevoDetalle });
        this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };
      }
    } else {
      alert("Debe ingresar todos los datos del detalle para agregarlo.");
    }
  }


  cancelarDetalle(detalle: any) {
    this.botonGuardarDetalle = false;

    const index = this.obj_compras.detalles.indexOf(detalle);
    console.log("ID COMPRA EN CANCELAR", this.idCompra);

    if(!this.idCompra) {
      this.botonCancelar = true;
      if (index !== -1) {
        console.log("Cancelando detalle:", detalle);
        this.obj_compras.detalles.splice(index, 1); // Elimina el detalle de la lista de detalles de compra
      } else {
        console.log("Detalle no encontrado:", detalle);
      }
    } else {
      this.botonCancelar = false;
    }
    
    
  }

  guardarCompra() {

    this.scompras.insertarCompra(this.obj_compras).subscribe(async (datos: any) => {
      console.log("Datos recibidos de la API:", datos);
      console.log("Objeto compras");

      console.log(this.obj_compras);
      console.log("s compras");
      console.log(this.scompras);

      if (datos != null) {
        const idCompra = datos.id_compra;

        console.log("ID COMPRA ANTES DE GUARDARDETALLES");
        console.log(idCompra);

        await this.guardarDetallesCompra(idCompra);
      } else {
        alert("Error al guardar la compra: " + datos.mensaje);
      }
      console.log(this.obj_compras);
    }
    );
  }


  async guardarDetallesCompra(idCompra: number) {
    console.log("COMPRAS ANTES DE GUARDAR DETALLES");
    console.log(this.obj_compras);


    const detallesConIdCompra = this.obj_compras.detalles.map((detalle) => ({
      ...detalle,
      fo_compras: Number(idCompra)
    }));

    console.log("DETALLES CON ID COMPRA:");

    console.log(detallesConIdCompra);

    for (let detalle of detallesConIdCompra) {
      await this.sdetalle.insertarDetalleCompra(detalle).toPromise()

    }
    this.limpiar();
    this.consulta(); // Actualiza la lista de compras
  }


  // // Validaciones para la compra
  validarCompra(funcion: any) {
    this.validar_iva = this.obj_compras.iva > 0;
    console.log("Iva:", this.validar_iva);


    this.validar_fecha = this.obj_compras.fecha.trim() !== "";
    console.log("Fecha:", this.validar_fecha);


    this.validar_fo_proveedor = this.obj_compras.fo_proveedor !== 0;
    console.log("FO_PROVEEDOR", this.validar_fo_proveedor);


    this.validar_fo_usuario = this.obj_compras.fo_usuario > 0;
    console.log("FO_USUARIO:", this.validar_fo_usuario);


    // Verificar si hay al menos un detalle con producto, cantidad y precio
    this.validar_fo_producto = this.obj_compras.detalles.length > 0 && this.obj_compras.detalles.some(detalle =>
      detalle.fo_producto > 0 && detalle.cantidad > 0 && detalle.precio > 0
    );
    console.log("FO_PRODUCTO:", this.validar_fo_producto);

    // Validar detalles también
    this.validar_cantidad = this.obj_compras.detalles.some(detalle => detalle.cantidad > 0);
    this.validar_precio = this.obj_compras.detalles.some(detalle => detalle.precio > 0);

    if (this.validar_iva && this.validar_fecha && this.validar_fo_proveedor && this.validar_fo_usuario && this.validar_fo_producto && funcion == "guardar") {
      this.guardarCompra();
      alert("Compra guardada");
    }

    if (this.validar_iva && this.validar_fecha && this.validar_fo_proveedor && this.validar_fo_usuario && this.validar_fo_producto && funcion == "editar") {
      this.editar();
      alert("Compra editada");
    }

    if (this.validar_iva && this.validar_fecha && this.validar_fo_proveedor && this.validar_fo_usuario && this.validar_fo_producto && funcion == "editarDetalle") {
      this.deshabilitarEdicion = false;
      this.botonGuardarDetalle = false;
      this.editarDetalles();
      alert("Compra editada");
    }
  }

  limpiar() {
    this.obj_compras = {
      fecha: '',
      iva: 0,
      fo_proveedor: 0,
      fo_usuario: 0,
      detalles: []
    };
    this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };
  }

  limpiarMensajesError() {
    this.validar_fecha = true;
    this.validar_iva = true;
    this.validar_fo_proveedor = true;
    this.validar_fo_usuario = true;

    this.validar_fo_producto = true;
    this.validar_cantidad = true;
    this.validar_precio = true;
  }

  eliminar(idCompra: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará la compra y todos sus detalles!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.scompras.eliminarCompra(idCompra).subscribe((respuesta: any) => {
          if (respuesta.resultado === "OK") {
            Swal.fire(
              'Eliminado!',
              respuesta.mensaje,
              'success'
            );
            this.consulta();
          } else {
            Swal.fire(
              'Error!',
              'No se pudo eliminar la compra.',
              'error'
            );
          }
        });
      }
    });
  }

  cargarDatos(items: any, id: number) {
    this.limpiarMensajesError();

    this.obj_compras = {
      fecha: items.fecha,
      iva: items.iva,
      fo_proveedor: items.fo_proveedor,
      fo_usuario: items.fo_usuario,
      detalles: [] as any[] // Arreglo para los detalles de compra
    };

    this.idCompra = id;
    this.botonesForm = true;
    this.mostrarForm('ver');



    // Cargar detalles de la compra
    console.log("Cargando detalles para la compra con ID:", id);
    this.sdetalle.buscarDetallesCompraPorId(id).subscribe((detalles: any) => {
      console.log("Detalles de compra:", detalles);
      // Asignar detalles con formato adecuado
      this.obj_compras.detalles = detalles.map((detalle: any) => ({
        // producto: detalle.fo_producto,
        // cantidad: detalle.cantidad,
        // precio: detalle.precio,
        ...detalle, // Incluir todas las propiedades necesarias
        id_detalle_compra: detalle.id_detalle_compra // Guarda el ID del detalle para operaciones futuras
      }));
    });
  }

  // Método para eliminar un detalle
  eliminarDetalle(id_detalle_compra: number) {
    this.botonGuardarDetalle = false;
    const id_numero = Number(id_detalle_compra);
    console.log("ID Detalle a eliminar:", id_numero);
    console.log("Tipo de id_detalle_compra:", typeof id_numero); // Esto debe ser "number"

    // Asegúrate de que id_detalle_compra es un número antes de proceder
    if (typeof id_numero === 'number') {
      this.sdetalle.eliminarDetalleCompra(id_detalle_compra).subscribe((response: any) => {
        // Filtra el detalle eliminado de los detalles actuales
        this.obj_compras.detalles = this.obj_compras.detalles.filter(detalle => detalle.id_detalle_compra !== id_detalle_compra);
        console.log("Detalle eliminado:", response);
      });
    } else {
      console.error("El ID del detalle no es un número.");
    }
  }

  editar() {
    this.scompras.editarCompra(this.idCompra, this.obj_compras).subscribe((datos: any) => {
      if (datos['resultado'] == "OK") {
        this.consulta();
      }
    });

    this.limpiar();
    this.mostrarForm("ocultar");
  }

  editarDetalles() {
    // this.obj_compras.detalles.forEach(detalle => {
    //   if (detalle.id_detalle_compra) {
    //     const detalleActualizado = {...detalle}
    //     if(detalle.id_detalle_compra == this.idDetalleCompra) {
    //       detalleActualizado.fo_producto = this.nuevoDetalle.fo_producto;
    //       detalleActualizado.cantidad = this.nuevoDetalle.cantidad;
    //       detalleActualizado.precio = this.nuevoDetalle.precio;
    //     }
    //     // Llama al servicio para editar el detalle existente
    //     this.sdetalle.editarDetalleCompra(detalle.id_detalle_compra, detalleActualizado).subscribe((respuesta: any) => {
    //       console.log("Detalle actualizado:", respuesta);
    //       this.consulta();
    //     });
    //   } else {
    //     // Si es un nuevo detalle, lo inserta
    //     this.sdetalle.insertarDetalleCompra(detalle).subscribe((respuesta: any) => {
    //       console.log("Nuevo detalle agregado:", respuesta);
    //     });
    //   }
    // });
    const detalleActualizado = this.obj_compras.detalles.find(detalle => detalle.id_detalle_compra == this.idDetalleCompra);


    if (detalleActualizado) {
      detalleActualizado.fo_producto = this.nuevoDetalle.fo_producto;
      detalleActualizado.producto = this.productos.find(producto => producto.id_producto == this.nuevoDetalle.fo_producto)?.nombre;


      detalleActualizado.cantidad = this.nuevoDetalle.cantidad;
      detalleActualizado.precio = this.nuevoDetalle.precio;

      this.sdetalle.editarDetalleCompra(detalleActualizado.id_detalle_compra, detalleActualizado).subscribe((respuesta: any) => {
        console.log("Detalle actualizado:", respuesta);
        this.consulta();
        this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };
      });
    } else {
      const detalleCreado = {
        fo_producto: this.nuevoDetalle.fo_producto,
        producto: this.productos.find(prod => prod.id_producto == this.nuevoDetalle.fo_producto)?.nombre,
        cantidad: this.nuevoDetalle.cantidad,
        precio: this.nuevoDetalle.precio,
        fo_compras: this.idCompra
      }
      console.log("DETALLE CREADO");

      console.log(detalleCreado)

      // Si es un nuevo detalle, lo inserta
      this.sdetalle.insertarDetalleCompra(detalleCreado).subscribe((respuesta: any) => {
        console.log("Nuevo detalle agregado:", respuesta);
        this.consulta();
      });
    }

  }

  cargarDetalle(detalle: any) {
    this.botonGuardarDetalle = true;
    this.deshabilitarEdicion = true;

    this.nuevoDetalle = {
      producto: detalle.producto,
      fo_producto: detalle.fo_producto,
      cantidad: detalle.cantidad,
      precio: detalle.precio
    };

    console.log("Producto editado:", this.nuevoDetalle.fo_producto);

    this.idDetalleCompra = detalle.id_detalle_compra;
  }
}


