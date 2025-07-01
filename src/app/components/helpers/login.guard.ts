import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private route: Router
  ) {}

  canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree {
  if (this._authService.obtenerToken()) {
    // Si ya hay token, redirige a otra vista
    return this.route.parseUrl('/menu'); // o donde prefieras
  }
  // Si no hay token, permite entrar al login
  return true;
}
}