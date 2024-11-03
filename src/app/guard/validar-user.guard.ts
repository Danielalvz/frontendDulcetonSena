// import { CanActivateFn } from '@angular/router';

// export const validarUserGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class validarUserGuard implements CanActivate {
  idUser: any;

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.idUser = sessionStorage.getItem('id');

    console.log(this.idUser);
    

    if (this.idUser == null || this.idUser == "") {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
