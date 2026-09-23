import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuards', () => {
  let authServiceSpy: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    bypassLogin: ReturnType<typeof vi.fn>;
  };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = {
      isAuthenticated: vi.fn(),
      bypassLogin: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    });
  });

  describe('authGuard', () => {
    it('should bypass login if unauthenticated and allow activation', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(authServiceSpy.bypassLogin).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should allow activation when already authenticated without calling bypass', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      expect(authServiceSpy.bypassLogin).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('guestGuard', () => {
    it('should allow access to guest routes', () => {
      const result = TestBed.runInInjectionContext(() => guestGuard(mockRoute, mockState));
      expect(result).toBe(true);
    });
  });
});
