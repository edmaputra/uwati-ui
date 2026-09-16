import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  Facility,
  FacilityType,
  FacilityStatus,
  CreateFacilityRequest,
  UpdateFacilityRequest,
  ChangeFacilityStatusRequest
} from '../models/facility.models';

const INITIAL_MOCK_FACILITIES: Facility[] = [
  {
    id: '01955f1a-b328-7000-8000-000000000001',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'METRO-GEN-01',
    name: 'Metro General Hospital',
    type: 'HOSPITAL',
    classification: 'CLASS_A',
    status: 'ACTIVE',
    phone: '+1-555-0199',
    address: '100 Healthcare Blvd, Metro City',
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-03-10T14:20:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000002',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'STJUDE-RES-02',
    name: "St. Jude Children's Research Clinic",
    type: 'CLINIC',
    classification: 'PRATAMA',
    status: 'ACTIVE',
    phone: '+1-555-0244',
    address: '250 Pediatric Way, East District',
    createdAt: '2026-02-01T09:15:00Z',
    updatedAt: '2026-03-12T11:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000003',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'CARDIO-SPEC-03',
    name: 'Heart & Vascular Specialized Hospital',
    type: 'HOSPITAL',
    classification: 'CLASS_B',
    status: 'ACTIVE',
    phone: '+1-555-0377',
    address: '88 Cardiology Suites, North Wing',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-14T16:45:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000004',
    tenantId: '11111111-1111-1111-1111-111111111111',
    code: 'WEST-AMBUL-04',
    name: 'Westside Ambulatory & Urgent Clinic',
    type: 'CLINIC',
    classification: 'UTAMA',
    status: 'UNDER_MAINTENANCE',
    phone: '+1-555-0488',
    address: '42 West Ave, Metro City',
    createdAt: '2026-02-28T13:20:00Z',
    updatedAt: '2026-03-15T09:10:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private http = inject(HttpClient);
  private mockFacilities = [...INITIAL_MOCK_FACILITIES];

  listFacilities(type?: FacilityType, status?: FacilityStatus): Observable<Facility[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Facility[]>('/api/v1/facilities', { params }).pipe(
      catchError(() => {
        let list = [...this.mockFacilities];
        if (type) list = list.filter((f) => f.type === type);
        if (status) list = list.filter((f) => f.status === status);
        return of(list);
      })
    );
  }

  getFacility(id: string): Observable<Facility> {
    return this.http.get<Facility>(`/api/v1/facilities/${id}`).pipe(
      catchError(() => {
        const found = this.mockFacilities.find((f) => f.id === id) || this.mockFacilities[0];
        return of(found);
      })
    );
  }

  createFacility(payload: CreateFacilityRequest): Observable<Facility> {
    return this.http.post<Facility>('/api/v1/facilities', payload).pipe(
      catchError(() => {
        const newFacility: Facility = {
          id: 'mock-' + Math.random().toString(36).substring(2, 9),
          tenantId: '11111111-1111-1111-1111-111111111111',
          code: payload.code,
          name: payload.name,
          type: payload.type,
          classification: payload.classification,
          status: 'ACTIVE',
          phone: payload.phone,
          address: payload.address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockFacilities.unshift(newFacility);
        return of(newFacility);
      })
    );
  }

  updateFacility(id: string, payload: UpdateFacilityRequest): Observable<Facility> {
    return this.http.put<Facility>(`/api/v1/facilities/${id}`, payload).pipe(
      catchError(() => {
        const idx = this.mockFacilities.findIndex((f) => f.id === id);
        if (idx !== -1) {
          this.mockFacilities[idx] = {
            ...this.mockFacilities[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockFacilities[idx]);
        }
        return of(this.mockFacilities[0]);
      })
    );
  }

  changeStatus(id: string, payload: ChangeFacilityStatusRequest): Observable<Facility> {
    return this.http.patch<Facility>(`/api/v1/facilities/${id}/status`, payload).pipe(
      catchError(() => {
        const idx = this.mockFacilities.findIndex((f) => f.id === id);
        if (idx !== -1) {
          this.mockFacilities[idx] = {
            ...this.mockFacilities[idx],
            status: payload.status,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockFacilities[idx]);
        }
        return of(this.mockFacilities[0]);
      })
    );
  }
}
