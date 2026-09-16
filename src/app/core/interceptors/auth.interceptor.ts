import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'corr-' + Math.random().toString(36).substring(2, 15);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const tenantId = authService.getTenantId();

  let headers = req.headers.set('X-Correlation-Id', generateCorrelationId());

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (tenantId) {
    headers = headers.set('X-Tenant-Id', tenantId);
  }

  const clonedRequest = req.clone({ headers });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/v1/auth/login')) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
