import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalStateService } from './services/medical-state.service';
import { NavbarComponent } from './components/layout/navbar.component';
import { SidebarComponent } from './components/layout/sidebar.component';
import { OverviewDashboardComponent } from './components/dashboard/overview-dashboard.component';
import { PatientListComponent } from './components/patients/patient-list.component';
import { PatientDetailModalComponent } from './components/patients/patient-detail-modal.component';
import { TriageViewComponent } from './components/triage/triage-view.component';
import { BedMatrixViewComponent } from './components/beds/bed-matrix-view.component';
import { PharmacyViewComponent } from './components/pharmacy/pharmacy-view.component';
import { DiagnosticsViewComponent } from './components/diagnostics/diagnostics-view.component';
import { NewAdmissionModalComponent } from './components/modals/new-admission-modal.component';
import { ApiGuideModalComponent } from './components/modals/api-guide-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    OverviewDashboardComponent,
    PatientListComponent,
    PatientDetailModalComponent,
    TriageViewComponent,
    BedMatrixViewComponent,
    PharmacyViewComponent,
    DiagnosticsViewComponent,
    NewAdmissionModalComponent,
    ApiGuideModalComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-sky-500 selection:text-white">
      
      <!-- Top Navigation Bar -->
      <app-navbar></app-navbar>

      <!-- Main Layout -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Clinical Left Sidebar -->
        <app-sidebar></app-sidebar>

        <!-- Dynamic Main Stage -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            
            <!-- Tab 1: Operations Dashboard -->
            <app-overview-dashboard *ngIf="state.currentTab() === 'dashboard'"></app-overview-dashboard>

            <!-- Tab 2: Patients & EHR -->
            <app-patient-list *ngIf="state.currentTab() === 'patients'"></app-patient-list>

            <!-- Tab 3: Emergency Triage -->
            <app-triage-view *ngIf="state.currentTab() === 'triage'"></app-triage-view>

            <!-- Tab 4: Beds Matrix -->
            <app-bed-matrix-view *ngIf="state.currentTab() === 'beds'"></app-bed-matrix-view>

            <!-- Tab 5: Central Pharmacy -->
            <app-pharmacy-view *ngIf="state.currentTab() === 'pharmacy'"></app-pharmacy-view>

            <!-- Tab 6: Diagnostics & PACS -->
            <app-diagnostics-view *ngIf="state.currentTab() === 'diagnostics'"></app-diagnostics-view>

          </div>
        </main>
      </div>

      <!-- Global Patient Detail Modal -->
      <app-patient-detail-modal></app-patient-detail-modal>

      <!-- Global Inpatient Admission Modal -->
      <app-new-admission-modal></app-new-admission-modal>

      <!-- Global Backend API Contracts & FHIR Modal -->
      <app-api-guide-modal></app-api-guide-modal>

      <!-- Clinical Toast Notification -->
      <div
        *ngIf="state.toast()"
        class="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200"
      >
        <div
          class="px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md"
          [ngClass]="{
            'bg-slate-900/95 text-white border-slate-700': state.toast()?.type === 'info',
            'bg-emerald-950/95 text-emerald-200 border-emerald-700': state.toast()?.type === 'success',
            'bg-rose-950/95 text-rose-200 border-rose-700': state.toast()?.type === 'alert'
          }"
        >
          <span class="w-2 h-2 rounded-full bg-current animate-ping"></span>
          <span>{{ state.toast()?.message }}</span>
          <button (click)="state.clearToast()" class="ml-2 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      </div>

    </div>
  `
})
export class AppComponent {
  readonly state = inject(MedicalStateService);
}
