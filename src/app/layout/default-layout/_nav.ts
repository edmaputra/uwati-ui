import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'HIS'
    }
  },
  {
    title: true,
    name: 'Healthcare Organization'
  },
  {
    name: 'Facilities',
    url: '/organization/facilities',
    iconComponent: { name: 'cil-home' }
  },
  {
    name: 'Service Units',
    url: '/organization/service-units',
    iconComponent: { name: 'cil-grid' }
  },
  {
    title: true,
    name: 'Platform Management'
  },
  {
    name: 'Tenants & Settings',
    url: '/tenancy',
    iconComponent: { name: 'cil-layers' }
  },
  {
    title: true,
    name: 'Identity & Access (IAM)'
  },
  {
    name: 'Users',
    url: '/iam/users',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'User Groups',
    url: '/iam/groups',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Roles & Permissions',
    url: '/iam/roles',
    iconComponent: { name: 'cil-lock-locked' }
  },
  {
    name: 'Scope Hierarchy',
    url: '/iam/scopes',
    iconComponent: { name: 'cil-list' }
  }
];
