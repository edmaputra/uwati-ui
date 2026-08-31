import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MedicalStateService } from '../../services/medical-state.service';

interface RouteBreadcrumb {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-routing-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex items-center justify-between py-2 px-3 mb-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs">
      <!-- Breadcrumbs Path -->
      <nav class="flex items-center space-x-1.5 text-slate-500 font-medium" aria-label="Breadcrumb">
        <a routerLink="/dashboard" class="flex items-center gap-1 hover:text-sky-600 transition-colors">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>HIS Core</span>
        </a>
        
        <span class="text-slate-300">/</span>
        
        <span class="text-slate-800 font-bold flex items-center gap-1">
          <span>{{ currentRouteInfo().label }}</span>
        </span>
      </nav>

      <!-- Quick Context Switcher / Telemetry Tag -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Station: <strong>{{ state.currentUser().department }}</strong></span>
        </div>
        <div class="h-3.5 w-px bg-slate-200 hidden sm:block"></div>
        <span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200/60">
          ROUTE: {{ currentUrl() }}
        </span>
      </div>
    </div>
  `
})
export class AppRoutingComponent {
  private readonly router = inject(Router);
  readonly state = inject(MedicalStateService);

  private readonly navEnd = toSignal(
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
  );

  readonly currentUrl = computed(() => {
    this.navEnd(); // trigger reactivity on navigation
    return this.router.url;
  });

  readonly currentRouteInfo = computed<RouteBreadcrumb>(() => {
    const url = this.currentUrl();
    if (url.includes('/patients')) return { label: 'Patient Master Index & EHR', path: '/patients', icon: 'user-group' };
    if (url.includes('/triage')) return { label: 'Emergency Department Triage', path: '/triage', icon: 'exclamation-circle' };
    if (url.includes('/beds')) return { label: 'Inpatient Bed Matrix & Wards', path: '/beds', icon: 'table' };
    if (url.includes('/pharmacy')) return { label: 'Central Clinical Pharmacy Dispense', path: '/pharmacy', icon: 'beaker' };
    if (url.includes('/diagnostics')) return { label: 'Radiology PACS & Pathology Lab', path: '/diagnostics', icon: 'document-text' };
    return { label: 'Clinical Operations Overview', path: '/dashboard', icon: 'home' };
  });
}
