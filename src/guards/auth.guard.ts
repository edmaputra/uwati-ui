import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { MedicalStateService } from '../services/medical-state.service';

/**
 * Protects clinical workstation routes.
 * Redirects unauthenticated sessions to the secure Login portal.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const state = inject(MedicalStateService);
  const router = inject(Router);

  if (state.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

/**
 * Prevents authenticated healthcare staff from landing on the login page.
 */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const state = inject(MedicalStateService);
  const router = inject(Router);

  if (!state.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
