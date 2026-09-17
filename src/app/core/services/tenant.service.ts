import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  Tenant,
  CreateTenantRequest,
  TenantSettingResponse,
  ConfigureTenantSettingsRequest
} from '../models/tenancy.models';

const INITIAL_MOCK_SETTINGS: TenantSettingResponse[] = [
  {
    key: 'security.mfa_enforced',
    value: 'true',
    revision: 1
  },
  {
    key: 'facility.max_service_units',
    value: '50',
    revision: 1
  },
  {
    key: 'integrations.hl7_fhir_gateway',
    value: 'https://fhir.metrohospital.org/v4',
    revision: 2
  }
];

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private mockSettings = [...INITIAL_MOCK_SETTINGS];

  createTenant(payload: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>('/api/platform/tenants', payload).pipe(
      catchError(() => {
        const newTenant: Tenant = {
          id: 'mock-tenant-' + Math.random().toString(36).substring(2, 9),
          legalName: payload.legalName,
          displayName: payload.displayName,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return of(newTenant);
      })
    );
  }

  getTenantSettings(tenantId: string): Observable<TenantSettingResponse[]> {
    return this.http.get<TenantSettingResponse[]>(`/api/platform/tenants/${tenantId}/settings`).pipe(
      catchError(() => {
        return of(this.mockSettings);
      })
    );
  }

  configureTenantSettings(
    tenantId: string,
    payload: ConfigureTenantSettingsRequest
  ): Observable<TenantSettingResponse[]> {
    return this.http
      .put<TenantSettingResponse[]>(`/api/platform/tenants/${tenantId}/settings`, payload)
      .pipe(
        catchError(() => {
          this.mockSettings = payload.settings.map((s, idx) => ({
            key: s.key,
            value: s.value,
            revision: idx + 1
          }));
          return of(this.mockSettings);
        })
      );
  }
}
