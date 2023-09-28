import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isAuthenticated() {
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails == null || userDetails == '') {
      return false;
    }
    return true;
  }
  isUserActivated() {
    const userDetails = sessionStorage.getItem('userDetails');
    if (JSON.parse(userDetails!).IsActivated === false) {
      return false;
    }
    return true;
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
  redirectToChangePassword() {
    this.router.navigate(['/changepassword']);
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
