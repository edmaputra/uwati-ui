import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TenantService } from './tenant.service';
import { Tenant, TenantSettingResponse } from '../models/tenancy.models';

describe('TenantService', () => {
  let service: TenantService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TenantService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create tenant successfully via API', () => {
    const payload = { legalName: 'Hospital A', displayName: 'Hosp A' };
    const mockCreated: Tenant = {
      id: 'tenant-1',
      legalName: 'Hospital A',
      displayName: 'Hosp A',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    };

    service.createTenant(payload).subscribe((res) => {
      expect(res.id).toBe('tenant-1');
      expect(res.legalName).toBe('Hospital A');
    });

    const req = httpTesting.expectOne('/api/platform/tenants');
    expect(req.request.method).toBe('POST');
    req.flush(mockCreated);
  });

  it('should fallback to mock tenant when createTenant API fails', () => {
    const payload = { legalName: 'Fallback Hospital', displayName: 'Fallback' };

    service.createTenant(payload).subscribe((res) => {
      expect(res.legalName).toBe('Fallback Hospital');
      expect(res.status).toBe('ACTIVE');
      expect(res.id).toContain('mock-tenant-');
    });

    const req = httpTesting.expectOne('/api/platform/tenants');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should get tenant settings from API', () => {
    const mockSettings: TenantSettingResponse[] = [
      { key: 'theme', value: 'dark', revision: 1 }
    ];

    service.getTenantSettings('tenant-1').subscribe((res) => {
      expect(res).toEqual(mockSettings);
    });

    const req = httpTesting.expectOne('/api/platform/tenants/tenant-1/settings');
    expect(req.request.method).toBe('GET');
    req.flush(mockSettings);
  });

  it('should fallback to mock settings when getTenantSettings fails', () => {
    service.getTenantSettings('tenant-1').subscribe((res) => {
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].key).toBe('security.mfa_enforced');
    });

    const req = httpTesting.expectOne('/api/platform/tenants/tenant-1/settings');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should configure tenant settings via API', () => {
    const payload = { settings: [{ key: 'theme', value: 'light' }] };
    const mockUpdated: TenantSettingResponse[] = [
      { key: 'theme', value: 'light', revision: 2 }
    ];

    service.configureTenantSettings('tenant-1', payload).subscribe((res) => {
      expect(res).toEqual(mockUpdated);
    });

    const req = httpTesting.expectOne('/api/platform/tenants/tenant-1/settings');
    expect(req.request.method).toBe('PUT');
    req.flush(mockUpdated);
  });

  it('should fallback to updated mock settings when configureTenantSettings fails', () => {
    const payload = { settings: [{ key: 'new.key', value: 'new.val' }] };

    service.configureTenantSettings('tenant-1', payload).subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].key).toBe('new.key');
      expect(res[0].value).toBe('new.val');
      expect(res[0].revision).toBe(1);
    });

    const req = httpTesting.expectOne('/api/platform/tenants/tenant-1/settings');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
