import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let authServiceSpy: {
    getToken: ReturnType<typeof vi.fn>;
    getTenantId: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceSpy = {
      getToken: vi.fn(),
      getTenantId: vi.fn(),
      logout: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should attach correlation ID, Authorization header, and X-Tenant-Id header when available', () => {
    authServiceSpy.getToken.mockReturnValue('test-token');
    authServiceSpy.getTenantId.mockReturnValue('tenant-123');

    httpClient.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('X-Tenant-Id')).toBe('tenant-123');
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    req.flush({});
  });

  it('should not attach Authorization or X-Tenant-Id headers when not set', () => {
    authServiceSpy.getToken.mockReturnValue(null);
    authServiceSpy.getTenantId.mockReturnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('X-Tenant-Id')).toBe(false);
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    req.flush({});
  });

  it('should call authService.logout on 401 error for non-login endpoints', () => {
    authServiceSpy.getToken.mockReturnValue('expired-token');

    httpClient.get('/api/v1/facilities').subscribe({
      error: () => {}
    });

    const req = httpTesting.expectOne('/api/v1/facilities');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should not call authService.logout on 401 error for login endpoint', () => {
    httpClient.post('/api/v1/auth/login', {}).subscribe({
      error: () => {}
    });

    const req = httpTesting.expectOne('/api/v1/auth/login');
    req.flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).not.toHaveBeenCalled();
  });
});
