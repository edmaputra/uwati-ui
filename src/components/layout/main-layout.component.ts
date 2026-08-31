import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MedicalStateService } from '../../services/medical-state.service';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';
import { AppRoutingComponent } from '../routing/app-routing.component';
import { PatientDetailModalComponent } from '../patients/patient-detail-modal.component';
import { NewAdmissionModalComponent } from '../modals/new-admission-modal.component';
import { ApiGuideModalComponent } from '../modals/api-guide-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    AppRoutingComponent,
    PatientDetailModalComponent,
    NewAdmissionModalComponent,
    ApiGuideModalComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-sky-500 selection:text-white">
      
      <!-- Top Clinical Navigation Bar -->
      <app-navbar></app-navbar>

      <!-- Main Layout Workspace -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Clinical Left Sidebar Navigation -->
        <app-sidebar></app-sidebar>

        <!-- Dynamic Route Stage -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <!-- Dynamic Routing Header & Telemetry -->
            <app-routing-header></app-routing-header>

            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Global Patient Detail Modal -->
      <app-patient-detail-modal></app-patient-detail-modal>

      <!-- Global Inpatient Admission Modal -->
      <app-new-admission-modal></app-new-admission-modal>

      <!-- Global Backend API Contracts & FHIR Modal -->
      <app-api-guide-modal></app-api-guide-modal>

    </div>
  `
})
export class MainLayoutComponent {
  readonly state = inject(MedicalStateService);
}

