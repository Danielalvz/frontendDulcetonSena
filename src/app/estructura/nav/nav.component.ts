import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  nombre: any;
  cargo: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.nombre = sessionStorage.getItem("usuario");
    this.cargo = sessionStorage.getItem("tipo_usuario");
  }

  cerrar() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

}
