import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../core/services/account';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const isLoggedIn = this.accountService.isLoggedIn(); // Check JWT or session
    const requiredRole = route.data['role'] as string;   // Optional role check

    if (!isLoggedIn) {
      this.router.navigate(['/account/login']);
      return false;
    }

    // Check for role if specified
    if (requiredRole && this.accountService.getUserRole() !== requiredRole) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
