export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface Tenant {
  id: string;
  legalName: string;
  displayName: string;
  status: TenantStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTenantRequest {
  legalName: string;
  displayName: string;
}

export interface TenantSettingItem {
  key: string;
  value: string;
}

export interface TenantSettingResponse {
  key: string;
  value: string;
  revision: number;
}

export interface ConfigureTenantSettingsRequest {
  settings: TenantSettingItem[];
}
