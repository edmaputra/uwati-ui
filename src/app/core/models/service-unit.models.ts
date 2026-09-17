export type ServiceUnitType =
  | 'OUTPATIENT_CLINIC'
  | 'INPATIENT_WARD'
  | 'EMERGENCY'
  | 'INTENSIVE_CARE'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'RADIOLOGY'
  | 'SURGERY_THEATER'
  | 'CASHIER'
  | 'ADMINISTRATIVE';

export type ServiceUnitStatus = 'ACTIVE' | 'INACTIVE';

export interface ServiceUnit {
  id: string;
  tenantId: string;
  facilityId: string;
  code: string;
  name: string;
  type: ServiceUnitType;
  scopeNodeId?: string;
  status: ServiceUnitStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceUnitRequest {
  facilityId: string;
  code: string;
  name: string;
  type: ServiceUnitType;
  scopeNodeId?: string;
}

export interface UpdateServiceUnitRequest {
  name: string;
}

export interface ChangeServiceUnitStatusRequest {
  status: ServiceUnitStatus;
}
