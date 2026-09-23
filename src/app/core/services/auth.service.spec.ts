import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenResponse, UserProfile } from '../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  const mockUser: UserProfile = {
    id: 'user-123',
    email: 'user@uwati.org',
    fullName: 'Test User',
    isSuperAdmin: false,
    isTenantWide: true,
    tenantId: 'tenant-456',
    roles: ['CLINICIAN'],
    permissions: ['patients:read']
  };

  const mockTokenResponse: TokenResponse = {
    accessToken: 'access-token-abc',
    refreshToken: 'refresh-token-xyz',
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: mockUser
  };

  beforeEach(() => {
    localStorage.clear();
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should initialize with null state when localStorage is empty', () => {
    expect(service.getToken()).toBeNull();
    expect(service.getTenantId()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should login successfully and set session with explicit tenantId', () => {
    service.login({ email: 'user@uwati.org', password: 'password', tenantId: 'tenant-999' }).subscribe((res) => {
      expect(res).toEqual(mockTokenResponse);
    });

    const req = httpTesting.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockTokenResponse);

    expect(service.getToken()).toBe('access-token-abc');
    expect(service.getTenantId()).toBe('tenant-999');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.email).toBe('user@uwati.org');
    expect(localStorage.getItem('uwati_access_token')).toBe('access-token-abc');
  });

  it('should login and fallback to user.tenantId when credentials have no tenantId', () => {
    service.login({ email: 'user@uwati.org', password: 'password' }).subscribe();

    const req = httpTesting.expectOne('/api/v1/auth/login');
    req.flush(mockTokenResponse);

    expect(service.getTenantId()).toBe('tenant-456');
  });

  it('should refresh token successfully when refresh token exists', () => {
    service.setSession(mockTokenResponse);

    const refreshedTokens: TokenResponse = {
      ...mockTokenResponse,
      accessToken: 'new-access-token'
    };

    service.refreshToken().subscribe((res) => {
      expect(res.accessToken).toBe('new-access-token');
    });

    const req = httpTesting.expectOne('/api/v1/auth/refresh');
    expect(req.request.method).toBe('POST');
    req.flush(refreshedTokens);

    expect(service.getToken()).toBe('new-access-token');
  });

  it('should logout and fail when refreshToken is called with no stored token', () => {
    let errorReceived: Error | null = null;

    service.refreshToken().subscribe({
      error: (err) => {
        errorReceived = err;
      }
    });

    expect(errorReceived).toBeTruthy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout when refresh token request fails', () => {
    service.setSession(mockTokenResponse);

    service.refreshToken().subscribe({
      error: () => {}
    });

    const req = httpTesting.expectOne('/api/v1/auth/refresh');
    req.flush({ message: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.isAuthenticated()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load current user profile and set tenantId if not already set', () => {
    service.loadMe().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTesting.expectOne('/api/v1/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    expect(service.currentUser()?.id).toBe('user-123');
    expect(service.getTenantId()).toBe('tenant-456');
    expect(localStorage.getItem('uwati_user_profile')).toContain('user-123');
  });

  it('should bypass login for development / preview mode', () => {
    service.bypassLogin();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('demo-bypass-access-token');
    expect(service.currentUser()?.isSuperAdmin).toBe(true);
    expect(service.getTenantId()).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('should logout, clear state and localStorage, and redirect to /login', () => {
    service.setSession(mockTokenResponse);
    service.setTenantId('tenant-456');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getTenantId()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('uwati_access_token')).toBeNull();
    expect(localStorage.getItem('uwati_refresh_token')).toBeNull();
    expect(localStorage.getItem('uwati_tenant_id')).toBeNull();
    expect(localStorage.getItem('uwati_user_profile')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
