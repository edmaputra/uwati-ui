export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'LABORATORY' | 'PHARMACY';

export type FacilityClassification =
  | 'CLASS_A'
  | 'CLASS_B'
  | 'CLASS_C'
  | 'CLASS_D'
  | 'PRATAMA'
  | 'UTAMA'
  | 'NONE';

export type FacilityStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'UNDER_MAINTENANCE'
  | 'DECOMMISSIONED';

export interface Facility {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: FacilityType;
  classification: FacilityClassification;
  nationalRegistryCode?: string;
  scopeNodeId?: string;
  address?: string;
  phone?: string;
  status: FacilityStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFacilityRequest {
  code: string;
  name: string;
  type: FacilityType;
  classification: FacilityClassification;
  nationalRegistryCode?: string;
  scopeNodeId?: string;
  address?: string;
  phone?: string;
}

export interface UpdateFacilityRequest {
  name: string;
  classification: FacilityClassification;
  nationalRegistryCode?: string;
  address?: string;
  phone?: string;
}

export interface ChangeFacilityStatusRequest {
  status: FacilityStatus;
}
