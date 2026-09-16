import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, TokenResponse, UserProfile, RefreshTokenRequest } from '../models/auth.models';

const TOKEN_KEY = 'uwati_access_token';
const REFRESH_TOKEN_KEY = 'uwati_refresh_token';
const TENANT_KEY = 'uwati_tenant_id';
const USER_KEY = 'uwati_user_profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private accessTokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private refreshTokenSignal = signal<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));
  private tenantIdSignal = signal<string | null>(localStorage.getItem(TENANT_KEY));
  private userSignal = signal<UserProfile | null>(this.getStoredUser());

  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly activeTenantId = this.tenantIdSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());

  private getStoredUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/api/v1/auth/login', credentials).pipe(
      tap((res) => {
        this.setSession(res);
        if (credentials.tenantId) {
          this.setTenantId(credentials.tenantId);
        } else if (res.user?.tenantId) {
          this.setTenantId(res.user.tenantId);
        }
      })
    );
  }

  refreshToken(): Observable<TokenResponse> {
    const refresh = this.refreshTokenSignal();
    if (!refresh) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    const payload: RefreshTokenRequest = { refreshToken: refresh };
    return this.http.post<TokenResponse>('/api/v1/auth/refresh', payload).pipe(
      tap((res) => this.setSession(res)),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  loadMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/v1/auth/me').pipe(
      tap((user) => {
        this.userSignal.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        if (user.tenantId && !this.tenantIdSignal()) {
          this.setTenantId(user.tenantId);
        }
      })
    );
  }

  setSession(response: TokenResponse): void {
    if (response.accessToken) {
      this.accessTokenSignal.set(response.accessToken);
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      this.refreshTokenSignal.set(response.refreshToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }
    if (response.user) {
      this.userSignal.set(response.user);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  setTenantId(id: string): void {
    this.tenantIdSignal.set(id);
    localStorage.setItem(TENANT_KEY, id);
  }

  getTenantId(): string | null {
    return this.tenantIdSignal();
  }

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  bypassLogin(): void {
    const mockUser: UserProfile = {
      id: '01955f1a-b328-7000-8000-000000000001',
      email: 'admin@metro.org',
      fullName: 'Dr. Sarah Connor (Admin)',
      isSuperAdmin: true,
      isTenantWide: true,
      tenantId: '11111111-1111-1111-1111-111111111111',
      roles: ['TENANT_ADMIN', 'CHIEF_MEDICAL_OFFICER'],
      permissions: ['*']
    };

    const mockTokens: TokenResponse = {
      accessToken: 'demo-bypass-access-token',
      refreshToken: 'demo-bypass-refresh-token',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: mockUser
    };

    this.setSession(mockTokens);
    this.setTenantId(mockUser.tenantId!);
  }

  logout(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.tenantIdSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TENANT_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }
}
