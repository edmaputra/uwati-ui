import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  ServiceUnit,
  ServiceUnitType,
  ServiceUnitStatus,
  CreateServiceUnitRequest,
  UpdateServiceUnitRequest,
  ChangeServiceUnitStatusRequest
} from '../models/service-unit.models';

const INITIAL_MOCK_UNITS: ServiceUnit[] = [
  {
    id: '01955f1a-b328-7000-8000-000000000101',
    tenantId: '11111111-1111-1111-1111-111111111111',
    facilityId: '01955f1a-b328-7000-8000-000000000001',
    code: 'EMERGENCY-01',
    name: 'Emergency & Trauma Department',
    type: 'EMERGENCY',
    status: 'ACTIVE',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-15T11:30:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000102',
    tenantId: '11111111-1111-1111-1111-111111111111',
    facilityId: '01955f1a-b328-7000-8000-000000000001',
    code: 'ICU-CENTRAL',
    name: 'Intensive Care Unit (ICU)',
    type: 'INTENSIVE_CARE',
    status: 'ACTIVE',
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-02-16T12:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000103',
    tenantId: '11111111-1111-1111-1111-111111111111',
    facilityId: '01955f1a-b328-7000-8000-000000000001',
    code: 'CARDIO-CLINIC',
    name: 'Cardiology Outpatient Clinic',
    type: 'OUTPATIENT_CLINIC',
    status: 'ACTIVE',
    createdAt: '2026-01-22T08:30:00Z',
    updatedAt: '2026-02-18T14:15:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000104',
    tenantId: '11111111-1111-1111-1111-111111111111',
    facilityId: '01955f1a-b328-7000-8000-000000000001',
    code: 'CENTRAL-PHARM',
    name: 'Central Hospital Pharmacy',
    type: 'PHARMACY',
    status: 'ACTIVE',
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-02-20T16:00:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ServiceUnitService {
  private http = inject(HttpClient);
  private mockUnits = [...INITIAL_MOCK_UNITS];

  listServiceUnits(
    facilityId: string,
    type?: ServiceUnitType,
    status?: ServiceUnitStatus
  ): Observable<ServiceUnit[]> {
    let params = new HttpParams().set('facilityId', facilityId);
    if (type) {
      params = params.set('type', type);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ServiceUnit[]>('/api/v1/service-units', { params }).pipe(
      catchError(() => {
        let list = this.mockUnits.filter(
          (u) => !facilityId || u.facilityId === facilityId || u.facilityId === '01955f1a-b328-7000-8000-000000000001'
        );
        if (type) list = list.filter((u) => u.type === type);
        if (status) list = list.filter((u) => u.status === status);
        return of(list);
      })
    );
  }

  getServiceUnit(id: string): Observable<ServiceUnit> {
    return this.http.get<ServiceUnit>(`/api/v1/service-units/${id}`).pipe(
      catchError(() => {
        const found = this.mockUnits.find((u) => u.id === id) || this.mockUnits[0];
        return of(found);
      })
    );
  }

  createServiceUnit(payload: CreateServiceUnitRequest): Observable<ServiceUnit> {
    return this.http.post<ServiceUnit>('/api/v1/service-units', payload).pipe(
      catchError(() => {
        const newUnit: ServiceUnit = {
          id: 'mock-unit-' + Math.random().toString(36).substring(2, 9),
          tenantId: '11111111-1111-1111-1111-111111111111',
          facilityId: payload.facilityId,
          code: payload.code,
          name: payload.name,
          type: payload.type,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockUnits.unshift(newUnit);
        return of(newUnit);
      })
    );
  }

  updateServiceUnit(id: string, payload: UpdateServiceUnitRequest): Observable<ServiceUnit> {
    return this.http.put<ServiceUnit>(`/api/v1/service-units/${id}`, payload).pipe(
      catchError(() => {
        const idx = this.mockUnits.findIndex((u) => u.id === id);
        if (idx !== -1) {
          this.mockUnits[idx] = {
            ...this.mockUnits[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockUnits[idx]);
        }
        return of(this.mockUnits[0]);
      })
    );
  }

  changeStatus(id: string, payload: ChangeServiceUnitStatusRequest): Observable<ServiceUnit> {
    return this.http.patch<ServiceUnit>(`/api/v1/service-units/${id}/status`, payload).pipe(
      catchError(() => {
        const idx = this.mockUnits.findIndex((u) => u.id === id);
        if (idx !== -1) {
          this.mockUnits[idx] = {
            ...this.mockUnits[idx],
            status: payload.status,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockUnits[idx]);
        }
        return of(this.mockUnits[0]);
      })
    );
  }
}
