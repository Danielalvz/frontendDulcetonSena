import { Component } from '@angular/core';
import { TipoUsuarioService } from 'src/app/servicios/tipo-usuario.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {

  usuario: any;
  tipoUsuario: any;
  idUsuario: any;

  obj_usuario = {
    usuario: "",
    password: "",
    email: "",
    telefono: "",
    fo_tipo_usuario: 0
  }

  validar_usuario = true;
  validar_password = true;
  validar_email = true;
  validar_telefono = true;
  validar_fo_tipo_usuario = true;
  mform = false;
  botonesForm = false;

  constructor(private susuario: UsuarioService, private stipousuario: TipoUsuarioService) { }

  ngOnInit(): void { //se ejecuta cada vez que cargue el sitio
    this.consulta();
    this.consultarTipoUsuario();
  }

  consulta() {
    this.susuario.consultarUsuarios().subscribe((resultado: any) => {
      this.usuario = resultado;
    })
  }

  consultarTipoUsuario() {
    this.stipousuario.consultarTipoUsuarios().subscribe((resultado: any) => {
      this.tipoUsuario = resultado;
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
    this.obj_usuario = {
      usuario: "",
      password: "",
      email: "",
      telefono: "",
      fo_tipo_usuario: 0
    }
  }

  limpiarMensajesError() {
    this.validar_usuario = true;
    this.validar_password = true;
    this.validar_email = true;
    this.validar_telefono = true;
    this.validar_fo_tipo_usuario = true;
  }

  validarUsuario(funcion: any) {
    this.validar_usuario = this.obj_usuario.usuario.trim() !== "";

    this.validar_password = this.obj_usuario.password.trim() !== "";

    this.validar_email = this.obj_usuario.email.trim() !== "";

    this.validar_telefono = this.obj_usuario.telefono.trim() !== "";

    this.validar_fo_tipo_usuario = this.obj_usuario.fo_tipo_usuario !== 0;

    if (this.validar_usuario && this.validar_password && this.validar_email && this.validar_telefono && this.validar_fo_tipo_usuario && funcion == "guardar") {
      this.guardarUsuario();
    }

    if (this.validar_usuario && this.validar_password && this.validar_email && this.validar_telefono && this.validar_fo_tipo_usuario && funcion == "editar") {
      this.editar();
    }
  }

  guardarUsuario() {
    this.susuario.insertarUsuario(this.obj_usuario).subscribe((datos: any) => {
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
      title: "¿Está seguro de eliminar este usuario?",
      text: "El proceso no podrá ser revertido.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.susuario.eliminarUsuario(id).subscribe((datos: any) => {
          if (datos['resultado'] === 'OK') {
            Swal.fire({
              title: "Eliminado!",
              text: "El usuario ha sido eliminado.",
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
        }, (error) => {
          Swal.fire({
            title: "Error",
            text: "No se pudo completar la solicitud. Intente nuevamente.",
            icon: "error"
          });
        });
      }
    });
  }

  cargarDatos(items: any, id: number) {
    this.limpiarMensajesError(); 

    this.obj_usuario = {
      usuario: items.usuario,
      password: items.password,
      email: items.email,
      telefono: items.telefono,
      fo_tipo_usuario: items.fo_tipo_usuario
    }

    this.idUsuario = id;
    this.botonesForm = true;
    this.mostrarForm('ver');
  }

  editar() {
    this.susuario.editarUsuario(this.idUsuario, this.obj_usuario).subscribe((datos: any) => {
      if (datos['resultado'] == "OK") {
        this.consulta();
      }
    });

    this.limpiar();
    this.mostrarForm("ocultar");
  }

}
