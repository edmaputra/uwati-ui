import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./views/authentication/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
    data: {
      title: 'Login'
    }
  },
  {
    path: '',
    loadComponent: () => import('./layout').then((m) => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./views/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'organization',
        children: [
          {
            path: 'facilities',
            loadComponent: () =>
              import('./views/organization/facilities/facilities.component').then(
                (m) => m.FacilitiesComponent
              ),
            data: {
              title: 'Facilities'
            }
          },
          {
            path: 'service-units',
            loadComponent: () =>
              import('./views/organization/service-units/service-units.component').then(
                (m) => m.ServiceUnitsComponent
              ),
            data: {
              title: 'Service Units'
            }
          }
        ]
      },
      {
        path: 'tenancy',
        loadComponent: () =>
          import('./views/tenancy/tenancy.component').then((m) => m.TenancyComponent),
        data: {
          title: 'Tenants & Settings'
        }
      },
      {
        path: 'iam',
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./views/iam/users/users.component').then((m) => m.UsersComponent),
            data: {
              title: 'Users'
            }
          },
          {
            path: 'groups',
            loadComponent: () =>
              import('./views/iam/groups/groups.component').then((m) => m.GroupsComponent),
            data: {
              title: 'User Groups'
            }
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./views/iam/roles/roles.component').then((m) => m.RolesComponent),
            data: {
              title: 'Roles & Permissions'
            }
          },
          {
            path: 'scopes',
            loadComponent: () =>
              import('./views/iam/scopes/scopes.component').then((m) => m.ScopesComponent),
            data: {
              title: 'Scope Hierarchy'
            }
          }
        ]
      }
    ]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./views/authentication/routes').then((m) => m.routes)
  },
  {
    path: 'error-pages',
    loadChildren: () => import('./views/error-pages/routes').then((m) => m.routes)
  },
  { path: '**', redirectTo: 'dashboard' }
];
