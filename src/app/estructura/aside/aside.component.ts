import { Component } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent {
  nombre: any;
  cargo: any;

  constructor() {}

  ngOnInit() {
    this.nombre = sessionStorage.getItem("usuario");
    this.cargo = sessionStorage.getItem("tipo_usuario");
  }
}
