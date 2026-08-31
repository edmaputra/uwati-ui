import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './components/layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login-portal.component').then(
        (m) => m.LoginPortalComponent
      ),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/overview-dashboard.component').then(
            (m) => m.OverviewDashboardComponent
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./components/patients/patient-list.component').then(
            (m) => m.PatientListComponent
          ),
      },
      {
        path: 'triage',
        loadComponent: () =>
          import('./components/triage/triage-view.component').then(
            (m) => m.TriageViewComponent
          ),
      },
      {
        path: 'beds',
        loadComponent: () =>
          import('./components/beds/bed-matrix-view.component').then(
            (m) => m.BedMatrixViewComponent
          ),
      },
      {
        path: 'pharmacy',
        loadComponent: () =>
          import('./components/pharmacy/pharmacy-view.component').then(
            (m) => m.PharmacyViewComponent
          ),
      },
      {
        path: 'diagnostics',
        loadComponent: () =>
          import('./components/diagnostics/diagnostics-view.component').then(
            (m) => m.DiagnosticsViewComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
