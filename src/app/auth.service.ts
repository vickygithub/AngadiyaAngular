import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isAuthenticated() {
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails == null || JSON.parse(userDetails) == null) {
      return false;
    }
    return true;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
