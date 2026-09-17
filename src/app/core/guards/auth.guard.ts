import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    // Auto-bypass login for development / preview mode
    authService.bypassLogin();
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  return true;
};
