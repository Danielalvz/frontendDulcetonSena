import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { validarUserGuard } from './guard/validar-user.guard';

const routes: Routes = [
  {
    path: '', component: PrincipalComponent,
    children:
      [
        { path: 'dashboard', component: DashboardComponent, canActivate: [validarUserGuard] },
        { path: 'categoria', component: CategoriaComponent, canActivate: [validarUserGuard] },
        { path: 'producto', component: ProductoComponent, canActivate: [validarUserGuard] },
        { path: 'cliente', component: ClienteComponent, canActivate: [validarUserGuard] },
        { path: 'pedido', component: PedidoComponent, canActivate: [validarUserGuard] },
        { path: 'compra', component: CompraComponent, canActivate: [validarUserGuard] },
        { path: 'usuario', component: UsuarioComponent, canActivate: [validarUserGuard] },
        { path: 'soporte', component: SoporteComponent, canActivate: [validarUserGuard] },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
      ]
  },

  {path: 'login', component: LoginComponent},
  {path: '**', component: NoEncontroComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
