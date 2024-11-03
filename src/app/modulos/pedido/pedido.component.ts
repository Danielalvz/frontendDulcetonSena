import { Component } from '@angular/core';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { DetalleVentaService } from 'src/app/servicios/detalle-venta.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { VentaService } from 'src/app/servicios/venta.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent {
  ventas: any[] = [];
  detalles: any[] = [];
  clientes: any[] = [];
  usuarios: any[] = [];
  productos: any[] = [];
  idVenta: any;
  idDetalleVenta: any;

  obj_ventas = {
    fecha: '',
    iva: 0,
    fo_cliente: 0,
    fo_usuario: 0,
    detalles: [] as any[]
  };

  nuevoDetalle = {
    producto: "",
    fo_producto: 0,
    cantidad: 0,
    precio: 0
  };

  validar_fecha = true;
  validar_iva = true;
  validar_fo_cliente = true;
  validar_fo_usuario = true;

  validar_fo_producto = true;
  validar_cantidad = true;
  validar_precio = true;

  mform = false
  botonesForm = false;
  deshabilitarEdicion = false;
  botonCancelar = false;
  botonGuardarDetalle = false;

  constructor(private sventa: VentaService, private sdetalle: DetalleVentaService, private scliente: ClienteService, private susuario: UsuarioService, private sproducto: ProductoService) { }

  ngOnInit(): void {
    this.consulta();
    this.consultarCliente();
    this.consultarUsuario();
    this.consultarProductos();
  }

  consulta() {
    this.sventa.consultarVentas().subscribe((ventas: any) => {
      this.ventas = ventas;

      this.sdetalle.consultarDetallesVenta().subscribe((detalles: any) => {
        this.mapearDetallesAVentas(detalles);
      });
    });
  }

  mapearDetallesAVentas(detalles: any) {
    this.ventas.forEach((venta: any) => {
      venta.detalles = detalles.filter((detalle: any) => detalle.fo_venta === venta.id_venta);
    });
  }

  calcularTotalConIVA(venta: any): number {
    const subtotal = venta?.detalles?.reduce((total: number, detalle: any) => total + (detalle.cantidad * detalle.precio), 0) || 0;
    const iva = (subtotal * venta.iva) / 100;
    return subtotal + iva;
  }

  consultarCliente() {
    this.scliente.consultarClientes().subscribe((resultado: any) => {
      this.clientes = resultado;
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
      
      if (this.idVenta > 0) {
        this.botonCancelar = false;
        const detalleNuevo = {
          fo_producto: this.nuevoDetalle.fo_producto,
          producto: this.productos.find(prod => prod.id_producto === this.nuevoDetalle.fo_producto)?.nombre,
          cantidad: this.nuevoDetalle.cantidad,
          precio: this.nuevoDetalle.precio,
          fo_venta: this.idVenta
        };

        console.log("DETALLENUEVO", detalleNuevo);

        // Llama al servicio para insertar el detalle en la base de datos
        this.sdetalle.insertarDetalleVenta(detalleNuevo).subscribe({
          next: (respuesta) => {
            console.log("Nuevo detalle agregado a venta existente:", respuesta);

            this.consulta();

            this.obj_ventas.detalles.push(respuesta);
            this.consulta();

            this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };

          },
          error: (err) => console.error("Error al agregar detalle:", err)
        });
      } else {
        console.log("Agregando nuevo detalle en modo creación.");
        this.botonCancelar = true;
        console.log(this.nuevoDetalle);
        console.log(this.obj_ventas.detalles);

        this.obj_ventas.detalles.push({ ...this.nuevoDetalle });
        this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };
      }
    } else {
      alert("Debe ingresar todos los datos del detalle para agregarlo.");
    }

    //////////
    // if (this.nuevoDetalle.fo_producto > 0 && this.nuevoDetalle.cantidad > 0 && this.nuevoDetalle.precio > 0) {
    //   this.obj_ventas.detalles.push({ ...this.nuevoDetalle });
    //   this.nuevoDetalle = { fo_producto: 0, cantidad: 0, precio: 0 };
    // } else {
    //   alert("Debe ingresar todos los datos del detalle");
    // }
  }

  cancelarDetalle(detalle: any) {
    this.botonGuardarDetalle = false;
    const index = this.obj_ventas.detalles.indexOf(detalle);
    console.log("ID VENTA EN CANCELAR", this.idVenta);

    if (!this.idVenta) {
      this.botonCancelar = true;
      if (index !== -1) {
        console.log("Cancelando detalle:", detalle);
        this.obj_ventas.detalles.splice(index, 1); // Elimina el detalle de la lista de detalles de venta
      } else {
        console.log("Detalle no encontrado:", detalle);
      }
    } else {
      this.botonCancelar = false;
    }


  }

  guardarVenta() {

    this.sventa.insertarVenta(this.obj_ventas).subscribe(async (datos: any) => {
      console.log("Datos recibidos de la API:", datos);

      if (datos != null) {
        const idVenta = datos.id_venta;

        console.log(idVenta);

        await this.guardarDetallesVenta(idVenta);
      } else {
        alert("Error al guardar la venta: " + datos.mensaje);
      }
    }
    );
  }

  async guardarDetallesVenta(idVenta: number) {
    this.botonGuardarDetalle = false;

    const detallesConIdVenta = this.obj_ventas.detalles.map((detalle) => ({
      ...detalle,
      fo_venta: Number(idVenta)
    }));


    for (let detalle of detallesConIdVenta) {
      await this.sdetalle.insertarDetalleVenta(detalle).toPromise()

    }

    this.consulta();
    this.limpiar();
    
  }

  validarVenta(funcion: any) {
    this.validar_iva = this.obj_ventas.iva > 0;

    this.validar_fecha = this.obj_ventas.fecha.trim() !== "";

    this.validar_fo_cliente = this.obj_ventas.fo_cliente !== 0;

    this.validar_fo_usuario = this.obj_ventas.fo_usuario > 0;

    this.validar_fo_producto = this.obj_ventas.detalles.length > 0 || this.nuevoDetalle.fo_producto > 0;

    this.validar_cantidad = this.obj_ventas.detalles.length > 0 || this.nuevoDetalle.cantidad > 0;

    this.validar_precio = this.obj_ventas.detalles.length > 0 || this.nuevoDetalle.precio > 0;


    if (this.validar_iva && this.validar_fecha && this.validar_fo_cliente && this.validar_fo_usuario && this.validar_fo_producto && funcion == "guardar") {
      this.guardarVenta();
      alert("Venta guardada")
    }

    if (this.validar_iva && this.validar_fecha && this.validar_fo_cliente && this.validar_fo_usuario && this.validar_fo_producto && funcion == "editar") {
      this.editar();
      alert("Venta editada");
    }

    if (this.validar_iva && this.validar_fecha && this.validar_fo_cliente && this.validar_fo_usuario && this.validar_fo_producto && funcion == "editarDetalle") {
      this.deshabilitarEdicion = false;
      this.editarDetalles();
      this.botonGuardarDetalle = false;
      alert("Detalle editado");
    }

  }

  limpiar() {
    this.obj_ventas = {
      fecha: '',
      iva: 0,
      fo_cliente: 0,
      fo_usuario: 0,
      detalles: []
    };
    this.nuevoDetalle = { producto: "", fo_producto: 0, cantidad: 0, precio: 0 };
  }

  limpiarMensajesError() {
    this.validar_fecha = true;
    this.validar_iva = true;
    this.validar_fo_cliente = true;
    this.validar_fo_usuario = true;

    this.validar_fo_producto = true;
    this.validar_cantidad = true;
    this.validar_precio = true;
  }

  eliminar(idVenta: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará la venta y todos sus detalles!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sventa.eliminarVenta(idVenta).subscribe((respuesta: any) => {
          if (respuesta.resultado === "OK") {
            Swal.fire(
              'Eliminado!',
              respuesta.mensaje,
              'success'
            );
            this.consulta(); // Método para refrescar la lista de ventas
          } else {
            Swal.fire(
              'Error!',
              'No se pudo eliminar la venta.',
              'error'
            );
          }
        });
      }
    });

  }

  cargarDatos(items: any, id: number) {
    this.limpiarMensajesError();

    this.obj_ventas = {
      fecha: items.fecha,
      iva: items.iva,
      fo_cliente: items.fo_cliente,
      fo_usuario: items.fo_usuario,
      detalles: [] as any[]
    };

    this.idVenta = id;
    this.botonesForm = true;
    this.mostrarForm('ver');


    this.sdetalle.buscarDetallesVentaPorId(id).subscribe((detalles: any) => {
      this.obj_ventas.detalles = detalles.map((detalle: any) => ({
        ...detalle,
        id_detalle_venta: detalle.id_detalle_venta // Guarda el ID del detalle para operaciones futuras
      }));
    });
  }

  eliminarDetalle(id_detalle_venta: number) {
    this.botonGuardarDetalle = false;

    const id_numero = Number(id_detalle_venta);

    if (typeof id_numero === 'number') {
      this.sdetalle.eliminarDetalleVenta(id_detalle_venta).subscribe((response: any) => {
        this.obj_ventas.detalles = this.obj_ventas.detalles.filter(detalle => detalle.id_detalle_venta !== id_detalle_venta);
        console.log("Detalle eliminado:", response);
      });
    } else {
      console.error("El ID del detalle no es un número.");
    }
  }

  editar() {
    this.sventa.editarVenta(this.idVenta, this.obj_ventas).subscribe((datos: any) => {
      if (datos['resultado'] == "OK") {
        this.consulta();
      }
    });

    this.limpiar();
    this.mostrarForm("ocultar");
  }

  editarDetalles() {
    const detalleActualizado = this.obj_ventas.detalles.find(detalle => detalle.id_detalle_venta == this.idDetalleVenta);


    if (detalleActualizado) {
      detalleActualizado.fo_producto = this.nuevoDetalle.fo_producto;
      //detalleActualizado.producto = this.productos.find(producto => producto.id_producto == this.nuevoDetalle.fo_producto)?.nombre;

      const productoEncontrado = this.productos.find(producto => producto.id_producto == this.nuevoDetalle.fo_producto);
      if (productoEncontrado) {
        this.nuevoDetalle.producto = productoEncontrado.nombre; // Asegúrate de que productoEncontrado tenga el nombre
      } else {
        console.error("Producto no encontrado");
        this.nuevoDetalle.producto = "Producto no disponible";
      }
      
      detalleActualizado.cantidad = this.nuevoDetalle.cantidad;
      detalleActualizado.precio = this.nuevoDetalle.precio;

      this.sdetalle.editarDetalleVenta(detalleActualizado.id_detalle_venta, detalleActualizado).subscribe((respuesta: any) => {
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
        fo_venta: this.idVenta
      }
      console.log("DETALLE CREADO");

      console.log(detalleCreado)

      // Si es un nuevo detalle, lo inserta
      this.sdetalle.insertarDetalleVenta(detalleCreado).subscribe((respuesta: any) => {
        console.log("Nuevo detalle agregado:", respuesta);
        this.consulta();
      });
    }
  }

  cargarDetalle(detalle: any) {
    this.deshabilitarEdicion = true;
    this.botonGuardarDetalle = true;

    this.nuevoDetalle = {
      producto: detalle.producto,
      fo_producto: detalle.fo_producto,
      cantidad: detalle.cantidad,
      precio: detalle.precio
    };

    console.log("Producto editado:", this.nuevoDetalle.fo_producto);
    console.log("Detalle cargado:", detalle);

    this.idDetalleVenta = detalle.id_detalle_venta;
  }
}
