import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from './services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private sessionStorageService:SessionStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const username = this.sessionStorageService.getSession('username');
      const password = this.sessionStorageService.getSession('password');

      if (username && password) {
        // Credentials are stored in cookies, so redirect to dashboard
        this.router.navigate(['/auth/dashboard']);
        return false;
      } else {
        // Credentials are not stored in cookies, so allow access
        return true;
      }
  }

}
