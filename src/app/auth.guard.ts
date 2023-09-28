import { CanActivateFn } from '@angular/router';
import { AuthService } from '../app/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (!auth.isAuthenticated()) {
    auth.redirectToLogin();
    return false;
  }
  if (!auth.isUserActivated()) {
    auth.redirectToChangePassword();
    return false;
  }
  return true;
};
