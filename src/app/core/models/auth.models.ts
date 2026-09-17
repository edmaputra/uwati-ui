export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  isTenantWide: boolean;
  tenantId?: string;
  roles: string[];
  permissions: string[];
  accessibleScopeNodeIds?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: UserProfile;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
