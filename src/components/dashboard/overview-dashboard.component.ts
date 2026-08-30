import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalStateService } from '../../services/medical-state.service';
import { TriageBadgeComponent, PatientStatusBadgeComponent } from '../common/medical-badges.component';
import { Patient, HospitalAlert } from '../../types';

@Component({
  selector: 'app-overview-dashboard',
  standalone: true,
  imports: [CommonModule, TriageBadgeComponent, PatientStatusBadgeComponent],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Top Clinical Emergency Ticker & Active Code Alerts -->
      <div *ngIf="unacknowledgedAlerts().length > 0" class="space-y-2">
        <div
          *ngFor="let alert of unacknowledgedAlerts()"
          class="p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start sm:items-center justify-between gap-3 shadow-xs"
          [ngClass]="{
            'bg-rose-50 border-rose-300 ring-1 ring-rose-200 text-rose-950': alert.level === 'CODE_RED' || alert.level === 'CODE_BLUE',
            'bg-amber-50 border-amber-300 ring-1 ring-amber-200 text-amber-950': alert.level === 'CODE_YELLOW' || alert.level === 'CRITICAL_LAB',
            'bg-sky-50 border-sky-300 text-sky-950': alert.level === 'CAPACITY_WARNING'
          }"
        >
          <div class="flex items-start sm:items-center gap-3">
            <div class="p-2 rounded-xl bg-white/80 flex-shrink-0 shadow-2xs">
              <svg class="w-5 h-5" [ngClass]="alert.level === 'CODE_RED' ? 'text-rose-600' : 'text-amber-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono font-black text-xs px-2 py-0.5 rounded uppercase"
                  [ngClass]="alert.level === 'CODE_RED' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'"
                >
                  {{ alert.level.replace('_', ' ') }}
                </span>
                <span class="font-bold text-xs sm:text-sm">{{ alert.location }}</span>
                <span class="text-xs opacity-75 font-mono">• {{ alert.timestamp }}</span>
              </div>
              <p class="text-xs mt-0.5 font-medium leading-relaxed">{{ alert.message }}</p>
            </div>
          </div>

          <button
            (click)="state.acknowledgeAlert(alert.id)"
            class="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-slate-800 shadow-2xs border border-slate-200 hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>

      <!-- Welcome Banner & Station Status -->
      <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold font-mono text-sky-700 uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Hospital Operational Control Center</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {{ state.currentUser().name }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Active Station: <strong class="text-slate-800">{{ state.currentUser().department }}</strong> • Role: {{ state.currentUser().roleTitle }}
          </p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button
            (click)="state.isNewAdmissionOpen.set(true)"
            class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Admit Inpatient</span>
          </button>
          
          <button
            (click)="state.setTab('triage')"
            class="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Emergency Triage Queue ({{ state.triageQueue().length }})</span>
          </button>
        </div>
      </div>

      <!-- Main Hospital KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Metric 1: Inpatient Census & Bed Occupancy -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Hospital Bed Census</span>
            <div class="p-2 rounded-xl bg-sky-50 text-sky-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mt-3 font-mono">
            <span class="text-2xl font-bold text-slate-900">{{ occupiedBedsCount() }}/{{ totalBedsCount() }}</span>
            <span class="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
              {{ occupancyPercent() }}% Occupied
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-sky-600 h-1.5 rounded-full" [style.width.%]="occupancyPercent()"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>{{ availableBedsCount() }} beds available</span>
            <span>{{ cleaningBedsCount() }} sanitizing</span>
          </div>
        </div>

        <!-- Metric 2: Emergency Department Load -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Emergency Acuity Load</span>
            <div class="p-2 rounded-xl bg-rose-50 text-rose-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mt-3 font-mono">
            <span class="text-2xl font-bold text-slate-900">{{ state.triageQueue().length }}</span>
            <span class="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              {{ esi12Count() }} STAT High Acuity
            </span>
          </div>
          <div class="flex items-center gap-1 mt-3">
            <div class="flex-1 bg-rose-500 h-1.5 rounded-l-full" title="ESI 1-2"></div>
            <div class="flex-1 bg-amber-400 h-1.5" title="ESI 3"></div>
            <div class="flex-1 bg-emerald-400 h-1.5 rounded-r-full" title="ESI 4-5"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>Avg wait: 24 mins</span>
            <span>Target: &lt;30m</span>
          </div>
        </div>

        <!-- Metric 3: Critical Care & ICU Status -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">ICU & Critical Care</span>
            <div class="p-2 rounded-xl bg-purple-50 text-purple-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mt-3 font-mono">
            <span class="text-2xl font-bold text-slate-900">{{ criticalPatientsCount() }}</span>
            <span class="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              Telemetry Monitored
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-purple-600 h-1.5 rounded-full" style="width: 85%"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>Ventilators: 12 Active</span>
            <span>4 Free</span>
          </div>
        </div>

        <!-- Metric 4: Pharmacy Dispense Load -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">Inpatient Pharmacy</span>
            <div class="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mt-3 font-mono">
            <span class="text-2xl font-bold text-slate-900">{{ state.pharmacyOrders().length }}</span>
            <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {{ pendingRxCount() }} Pending Rx
            </span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-indigo-600 h-1.5 rounded-full" style="width: 70%"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>Verified: 100%</span>
            <span>STAT: 1 Active</span>
          </div>
        </div>

      </div>

      <!-- Two-Column Operational Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Active Inpatients Table -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-sm sm:text-base font-bold text-slate-900">Active Inpatient Roster</h2>
              <p class="text-xs text-slate-500">Real-time EHR census with continuous telemetry vitals</p>
            </div>
            <button
              (click)="state.setTab('patients')"
              class="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({{ state.patients().length }})</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="divide-y divide-slate-100 overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th class="p-3 pl-4">Patient / MRN</th>
                  <th class="p-3">Ward / Bed</th>
                  <th class="p-3">Diagnosis</th>
                  <th class="p-3">Latest Vitals</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  *ngFor="let p of topPatients()"
                  (click)="state.openPatientModal(p)"
                  class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td class="p-3 pl-4">
                    <div class="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{{ p.fullName }}</div>
                    <div class="text-[11px] text-slate-400 font-mono">{{ p.mrn }} • {{ p.age }}y • {{ p.gender }}</div>
                  </td>
                  <td class="p-3">
                    <div class="font-semibold text-slate-800 font-mono">{{ p.bedNumber }}</div>
                    <div class="text-[11px] text-slate-500">{{ p.ward }}</div>
                  </td>
                  <td class="p-3">
                    <div class="font-medium text-slate-800 truncate max-w-[160px]">{{ p.primaryDiagnosis }}</div>
                    <div class="text-[11px] text-slate-400 truncate max-w-[160px]">{{ p.attendingPhysician }}</div>
                  </td>
                  <td class="p-3 font-mono">
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-slate-900">{{ p.latestVitals.bloodPressure }}</span>
                      <span class="text-[10px] text-slate-400">BP</span>
                    </div>
                    <div class="text-[11px] text-slate-500">
                      HR {{ p.latestVitals.heartRate }} • SpO2 {{ p.latestVitals.oxygenSaturation }}%
                    </div>
                  </td>
                  <td class="p-3">
                    <app-patient-status-badge [status]="p.status"></app-patient-status-badge>
                  </td>
                  <td class="p-3 pr-4 text-right">
                    <button
                      class="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-sky-50 text-slate-600 group-hover:text-sky-700 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      Open EHR
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Col: Emergency Triage Live Feed & Ward Capacity -->
        <div class="space-y-6">
          
          <!-- Emergency Triage Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Emergency Triage Board</h3>
                <p class="text-xs text-slate-500">Awaiting physician assessment</p>
              </div>
              <button
                (click)="state.setTab('triage')"
                class="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Full Queue
              </button>
            </div>

            <div class="space-y-3">
              <div
                *ngFor="let item of state.triageQueue()"
                class="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div class="flex items-center justify-between">
                  <app-triage-badge [level]="item.triageLevel"></app-triage-badge>
                  <span class="text-[11px] font-mono text-slate-500">Wait: {{ item.waitingMinutes }}m</span>
                </div>
                <div class="font-bold text-xs text-slate-900">{{ item.patientName }} ({{ item.age }}y)</div>
                <p class="text-[11px] text-slate-600 line-clamp-1 font-medium">{{ item.chiefComplaint }}</p>
                <div class="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                  <span>{{ item.vitalsSummary }}</span>
                  <span class="font-semibold text-slate-700">{{ item.assignedZone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ward Bed Capacity Breakdown -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="text-sm font-bold text-slate-900">Ward Occupancy Breakdown</h3>
              <button
                (click)="state.setTab('beds')"
                class="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                Manage Beds
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div *ngFor="let dept of state.departments()" class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-800">{{ dept.name }}</span>
                  <span class="font-mono text-slate-500">{{ dept.occupiedBeds }}/{{ dept.totalBeds }} ({{ ((dept.occupiedBeds / dept.totalBeds) * 100).toFixed(0) }}%)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-1.5 rounded-full"
                    [ngClass]="(dept.occupiedBeds / dept.totalBeds) > 0.85 ? 'bg-rose-500' : 'bg-sky-600'"
                    [style.width.%]="(dept.occupiedBeds / dept.totalBeds) * 100"
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `
})
export class OverviewDashboardComponent {
  readonly state = inject(MedicalStateService);

  readonly unacknowledgedAlerts = computed(() =>
    this.state.alerts().filter((a) => !a.acknowledged)
  );

  readonly occupiedBedsCount = computed(() =>
    this.state.beds().filter((b) => b.status === 'occupied').length
  );

  readonly totalBedsCount = computed(() => this.state.beds().length);

  readonly availableBedsCount = computed(() =>
    this.state.beds().filter((b) => b.status === 'available').length
  );

  readonly cleaningBedsCount = computed(() =>
    this.state.beds().filter((b) => b.status === 'cleaning').length
  );

  readonly occupancyPercent = computed(() => {
    const total = this.totalBedsCount();
    if (total === 0) return 0;
    return Math.round((this.occupiedBedsCount() / total) * 100);
  });

  readonly esi12Count = computed(() =>
    this.state.triageQueue().filter((t) => t.triageLevel <= 2).length
  );

  readonly criticalPatientsCount = computed(() =>
    this.state.patients().filter((p) => p.status === 'critical').length
  );

  readonly pendingRxCount = computed(() =>
    this.state.pharmacyOrders().filter((o) => o.status === 'pending').length
  );

  readonly topPatients = computed(() => this.state.patients().slice(0, 6));
}
