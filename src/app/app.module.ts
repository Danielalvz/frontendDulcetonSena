import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './estructura/nav/nav.component';
import { AsideComponent } from './estructura/aside/aside.component';
import { FooterComponent } from './estructura/footer/footer.component';
import { PrincipalComponent } from './estructura/principal.component';
import { DashboardComponent } from './modulos/dashboard/dashboard.component';
import { CategoriaComponent } from './modulos/categoria/categoria.component';
import { ProductoComponent } from './modulos/producto/producto.component';
import { ClienteComponent } from './modulos/cliente/cliente.component';
import { PedidoComponent } from './modulos/pedido/pedido.component';
import { UsuarioComponent } from './modulos/usuario/usuario.component';
import { SoporteComponent } from './modulos/soporte/soporte.component';
import { CompraComponent } from './modulos/compra/compra.component';
import { LoginComponent } from './modulos/login/login.component';
import { NoEncontroComponent } from './modulos/no-encontro/no-encontro.component';
import { PedidoinsertarComponent } from './modulos/pedidoinsertar/pedidoinsertar.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AsideComponent,
    FooterComponent,
    PrincipalComponent,
    DashboardComponent,
    CategoriaComponent,
    ProductoComponent,
    ClienteComponent,
    PedidoComponent,
    UsuarioComponent,
    SoporteComponent,
    CompraComponent,
    LoginComponent,
    NoEncontroComponent,
    PedidoinsertarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
