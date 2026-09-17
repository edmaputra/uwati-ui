import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import {
  IamUser,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeUserStatusRequest,
  IamRole,
  CreateRoleRequest,
  IamGroup,
  CreateGroupRequest,
  ScopeNode,
  CreateScopeNodeRequest
} from '../models/iam.models';

const INITIAL_MOCK_USERS: IamUser[] = [
  {
    id: '01955f1a-b328-7000-8000-000000000001',
    email: 'admin@metro.org',
    fullName: 'Dr. Sarah Connor (Admin)',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000002',
    email: 'doctor@metro.org',
    fullName: 'Dr. Gregory House',
    status: 'ACTIVE',
    createdAt: '2026-01-12T09:30:00Z',
    updatedAt: '2026-02-10T14:20:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000003',
    email: 'nurse@metro.org',
    fullName: 'Nurse Jackie Peyton',
    status: 'ACTIVE',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-02-12T16:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000004',
    email: 'consultant@healthgroup.org',
    fullName: 'Dr. Allison Cameron',
    status: 'ACTIVE',
    createdAt: '2026-01-20T13:45:00Z',
    updatedAt: '2026-02-14T09:15:00Z'
  }
];

const INITIAL_MOCK_GROUPS: IamGroup[] = [
  {
    id: '01955f1a-b328-7000-8000-000000000201',
    name: 'Surgical Team Alpha',
    description: 'Operating room surgeons and scrub nurses',
    externalIdpGroupName: 'azure-ad-surgical-alpha',
    memberCount: 8,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000202',
    name: 'ICU Critical Care Staff',
    description: 'Round-the-clock intensive care physicians and nursing personnel',
    externalIdpGroupName: 'keycloak-icu-staff',
    memberCount: 14,
    createdAt: '2026-01-18T10:30:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000203',
    name: 'Clinical Pharmacy Operators',
    description: 'Pharmacists and medication inventory controllers',
    externalIdpGroupName: 'ldap-pharmacy-team',
    memberCount: 6,
    createdAt: '2026-01-22T14:00:00Z'
  }
];

const INITIAL_MOCK_ROLES: IamRole[] = [
  {
    id: '01955f1a-b328-7000-8000-000000000301',
    name: 'Hospital System Administrator',
    description: 'Full administrative access across hospital facilities and identity policies',
    isSystemRole: true,
    permissions: ['*'],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000302',
    name: 'Medical Doctor / Physician',
    description: 'Patient examination, electronic prescription, and clinical record access',
    isSystemRole: false,
    permissions: ['patient:read', 'patient:write', 'prescription:create', 'lab_order:create'],
    createdAt: '2026-01-05T00:00:00Z'
  },
  {
    id: '01955f1a-b328-7000-8000-000000000303',
    name: 'Registered Nurse',
    description: 'Vital signs recording, nursing shift logs, and medication administration',
    isSystemRole: false,
    permissions: ['patient:read', 'vitals:write', 'medication:administer'],
    createdAt: '2026-01-06T00:00:00Z'
  }
];

const INITIAL_MOCK_SCOPES: ScopeNode[] = [
  {
    id: 'aaaa1111-0000-0000-0000-000000000001',
    name: 'Metro General Hospital (Root)',
    code: 'METRO_HOSPITAL',
    path: '/11111111-1111-1111-1111-111111111111/aaaa1111-0000-0000-0000-000000000001/',
    children: [
      {
        id: 'aaaa1111-0000-0000-0000-000000000002',
        name: 'Cardiology Center',
        code: 'CARDIOLOGY',
        path: '/11111111-1111-1111-1111-111111111111/aaaa1111-0000-0000-0000-000000000001/aaaa1111-0000-0000-0000-000000000002/',
        parentId: 'aaaa1111-0000-0000-0000-000000000001',
        children: []
      },
      {
        id: 'aaaa1111-0000-0000-0000-000000000003',
        name: 'Intensive Care Unit (ICU)',
        code: 'ICU',
        path: '/11111111-1111-1111-1111-111111111111/aaaa1111-0000-0000-0000-000000000001/aaaa1111-0000-0000-0000-000000000003/',
        parentId: 'aaaa1111-0000-0000-0000-000000000001',
        children: []
      },
      {
        id: 'aaaa1111-0000-0000-0000-000000000004',
        name: 'Pediatrics Department',
        code: 'PEDIATRICS',
        path: '/11111111-1111-1111-1111-111111111111/aaaa1111-0000-0000-0000-000000000001/aaaa1111-0000-0000-0000-000000000004/',
        parentId: 'aaaa1111-0000-0000-0000-000000000001',
        children: []
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private http = inject(HttpClient);
  private mockUsers = [...INITIAL_MOCK_USERS];
  private mockGroups = [...INITIAL_MOCK_GROUPS];
  private mockRoles = [...INITIAL_MOCK_ROLES];
  private mockScopes = [...INITIAL_MOCK_SCOPES];

  // Users
  listUsers(search?: string, status?: string): Observable<IamUser[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<IamUser[]>('/api/v1/iam/users', { params }).pipe(
      catchError(() => {
        let list = [...this.mockUsers];
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(
            (u) => u.email.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q)
          );
        }
        if (status) {
          list = list.filter((u) => u.status === status);
        }
        return of(list);
      })
    );
  }

  getUser(id: string): Observable<IamUser> {
    return this.http.get<IamUser>(`/api/v1/iam/users/${id}`).pipe(
      catchError(() => {
        const found = this.mockUsers.find((u) => u.id === id) || this.mockUsers[0];
        return of(found);
      })
    );
  }

  createUser(payload: CreateUserRequest): Observable<IamUser> {
    return this.http.post<IamUser>('/api/v1/iam/users', payload).pipe(
      catchError(() => {
        const newUser: IamUser = {
          id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
          email: payload.email,
          fullName: payload.fullName,
          status: payload.status || 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockUsers.unshift(newUser);
        return of(newUser);
      })
    );
  }

  updateUser(id: string, payload: UpdateUserRequest): Observable<IamUser> {
    return this.http.put<IamUser>(`/api/v1/iam/users/${id}`, payload).pipe(
      catchError(() => {
        const idx = this.mockUsers.findIndex((u) => u.id === id);
        if (idx !== -1) {
          this.mockUsers[idx] = {
            ...this.mockUsers[idx],
            fullName: payload.fullName,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockUsers[idx]);
        }
        return of(this.mockUsers[0]);
      })
    );
  }

  changeUserStatus(id: string, payload: ChangeUserStatusRequest): Observable<IamUser> {
    return this.http.patch<IamUser>(`/api/v1/iam/users/${id}/status`, payload).pipe(
      catchError(() => {
        const idx = this.mockUsers.findIndex((u) => u.id === id);
        if (idx !== -1) {
          this.mockUsers[idx] = {
            ...this.mockUsers[idx],
            status: payload.status,
            updatedAt: new Date().toISOString()
          };
          return of(this.mockUsers[idx]);
        }
        return of(this.mockUsers[0]);
      })
    );
  }

  getEffectiveAccess(id: string): Observable<any> {
    return this.http.get<any>(`/api/v1/iam/users/${id}/effective-access`).pipe(
      catchError(() => {
        return of({
          userId: id,
          roles: ['TENANT_ADMIN'],
          permissions: ['*'],
          accessibleScopePaths: ['/11111111-1111-1111-1111-111111111111/']
        });
      })
    );
  }

  // Groups
  listGroups(): Observable<IamGroup[]> {
    return this.http.get<IamGroup[]>('/api/v1/iam/groups').pipe(
      catchError(() => of(this.mockGroups))
    );
  }

  createGroup(payload: CreateGroupRequest): Observable<IamGroup> {
    return this.http.post<IamGroup>('/api/v1/iam/groups', payload).pipe(
      catchError(() => {
        const newGroup: IamGroup = {
          id: 'mock-group-' + Math.random().toString(36).substring(2, 9),
          name: payload.name,
          description: payload.description,
          externalIdpGroupName: payload.externalIdpGroupName,
          memberCount: 0,
          createdAt: new Date().toISOString()
        };
        this.mockGroups.unshift(newGroup);
        return of(newGroup);
      })
    );
  }

  getGroupMembers(groupId: string): Observable<IamUser[]> {
    return this.http.get<IamUser[]>(`/api/v1/iam/groups/${groupId}/members`).pipe(
      catchError(() => of(this.mockUsers.slice(0, 2)))
    );
  }

  // Roles & Permissions
  listRoles(): Observable<IamRole[]> {
    return this.http.get<IamRole[]>('/api/v1/iam/roles').pipe(
      catchError(() => of(this.mockRoles))
    );
  }

  createRole(payload: CreateRoleRequest): Observable<IamRole> {
    return this.http.post<IamRole>('/api/v1/iam/roles', payload).pipe(
      catchError(() => {
        const newRole: IamRole = {
          id: 'mock-role-' + Math.random().toString(36).substring(2, 9),
          name: payload.name,
          description: payload.description,
          isSystemRole: false,
          permissions: payload.permissions,
          createdAt: new Date().toISOString()
        };
        this.mockRoles.unshift(newRole);
        return of(newRole);
      })
    );
  }

  listPermissions(): Observable<string[]> {
    return this.http.get<string[]>('/api/v1/iam/permissions').pipe(
      catchError(() =>
        of([
          '*',
          'facility:read',
          'facility:write',
          'service_unit:read',
          'service_unit:write',
          'tenant:admin',
          'user:read',
          'user:write',
          'role:read',
          'role:write',
          'scope:read',
          'scope:write',
          'patient:read',
          'patient:write',
          'prescription:create'
        ])
      )
    );
  }

  // Scopes
  getScopeTree(): Observable<ScopeNode[]> {
    return this.http
      .get<ScopeNode[]>('/api/v1/iam/scopes', {
        params: new HttpParams().set('tree', 'true')
      })
      .pipe(catchError(() => of(this.mockScopes)));
  }

  listScopes(): Observable<ScopeNode[]> {
    return this.http
      .get<ScopeNode[]>('/api/v1/iam/scopes', {
        params: new HttpParams().set('tree', 'false')
      })
      .pipe(catchError(() => of(this.mockScopes)));
  }

  createScope(payload: CreateScopeNodeRequest): Observable<ScopeNode> {
    return this.http.post<ScopeNode>('/api/v1/iam/scopes', payload).pipe(
      catchError(() => {
        const newScope: ScopeNode = {
          id: 'mock-scope-' + Math.random().toString(36).substring(2, 9),
          name: payload.name,
          code: payload.code,
          parentId: payload.parentId,
          path: '/' + payload.code + '/',
          children: []
        };
        return of(newScope);
      })
    );
  }
}
