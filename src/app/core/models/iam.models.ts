export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface IamUser {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  fullName: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  fullName: string;
}

export interface ChangeUserStatusRequest {
  status: UserStatus;
}

export interface IamRole {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  permissions?: string[];
  createdAt?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface IamGroup {
  id: string;
  name: string;
  description?: string;
  externalIdpGroupName?: string;
  memberCount?: number;
  createdAt?: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  externalIdpGroupName?: string;
}

export interface ScopeNode {
  id: string;
  tenantId?: string;
  parentId?: string;
  code: string;
  name: string;
  path: string;
  createdAt?: string;
  updatedAt?: string;
  children?: ScopeNode[];
}

export interface CreateScopeNodeRequest {
  parentId?: string;
  code: string;
  name: string;
}
