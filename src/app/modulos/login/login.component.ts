import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login.service';
import { TipoUsuarioService } from 'src/app/servicios/tipo-usuario.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: any;
  password: any;
  usuario: any;
  //tipoUsuario: any;

  user = {
    usuario: "",
    password: "",
    email: "",
    telefono: "",
    fo_tipo_usuario: 0
  }

  error = false;

  constructor(private slogin: LoginService, private router: Router) { }

  ngOnInit(): void {
    //this.consultarTipoUsuario();

    sessionStorage.setItem("id", "");
    sessionStorage.setItem("email", "");
    sessionStorage.setItem("usuario", "");
    sessionStorage.setItem("tipo_usuario", "");
    sessionStorage.setItem("fo_tipo_usuario", "");



  }

  consulta(tecla: any) {
    if (tecla == 13 || tecla == "")
      this.slogin.consultarUsuario(this.email, this.password).subscribe((resultado: any) => {
        this.usuario = resultado;
        
        if (this.usuario[0].validar == "valida") {
          sessionStorage.setItem("id", this.usuario[0]["id_usuario"]);
          sessionStorage.setItem("email", this.usuario[0]["email"]);
          sessionStorage.setItem("usuario", this.usuario[0]["usuario"]);
          sessionStorage.setItem("tipo_usuario", this.usuario[0]["tipo_usuario"]);
          sessionStorage.setItem("fo_tipo_usuario", this.usuario[0]["fo_tipo_usuario"]);

          this.router.navigate(['dashboard']);
        } else {
          this.error = true;
        }
        
      })
  }

  // consultarTipoUsuario() {
  //   this.stipousuario.consultarTipoUsuarios().subscribe((resultado: any) => {
  //     this.tipoUsuario = resultado;
  //   });
  // }


}
