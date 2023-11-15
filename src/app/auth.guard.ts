import { CanActivateFn } from '@angular/router';
import { AuthService } from '../app/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  const auth = inject(AuthService);
  if (!auth.isAuthenticated()) {
    auth.redirectToLogin();
    return false;
  }
  if (!auth.isUserActivated()) {
    auth.redirectToChangePassword();
    return false;
  }
  if (route.data != null && route.data['projectTypes'] != null && !route.data['projectTypes'].includes(loggedInUser.ProjectType)) {
    auth.redirectToMain();
    return false;
  }
  return true;
};
