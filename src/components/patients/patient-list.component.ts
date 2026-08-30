import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalStateService } from '../../services/medical-state.service';
import { PatientStatusBadgeComponent, TriageBadgeComponent } from '../common/medical-badges.component';
import { Patient, WardType, PatientStatus } from '../../types';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientStatusBadgeComponent, TriageBadgeComponent],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Top Control Bar -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Inpatient Directory & EHR Master Index</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Browse active admissions, medical records, diagnostic statuses, and attending physician assignments
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="state.isNewAdmissionOpen.set(true)"
            class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Admit Inpatient</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        <!-- Search Input -->
        <div class="relative w-full md:w-80">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Filter by name, MRN, bed, or physician..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <!-- Dropdown Filters -->
        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <select
            [(ngModel)]="selectedWard"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:bg-white font-sans"
          >
            <option value="ALL">All Hospital Wards</option>
            <option value="ICU">Intensive Care (ICU)</option>
            <option value="Emergency (ED)">Emergency (ED)</option>
            <option value="Ward-A (Internal Med)">Ward-A (Internal Med)</option>
            <option value="Ward-B (Cardiology)">Ward-B (Cardiology)</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Surgical Recovery">Surgical Recovery</option>
            <option value="Maternity">Maternity</option>
          </select>

          <select
            [(ngModel)]="selectedStatus"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:bg-white font-sans"
          >
            <option value="ALL">All Clinical Statuses</option>
            <option value="critical">Critical / ICU</option>
            <option value="admitted">Admitted</option>
            <option value="observation">Observation</option>
            <option value="er_triage">ER Triage</option>
            <option value="discharged">Discharged</option>
          </select>

          <span class="text-slate-400 font-mono pl-2">
            Showing {{ filteredPatients().length }} of {{ state.patients().length }}
          </span>
        </div>

      </div>

      <!-- Main Patient Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th class="p-3.5 pl-5">Patient Name & Demographics</th>
                <th class="p-3.5">MRN & National ID</th>
                <th class="p-3.5">Ward & Bed</th>
                <th class="p-3.5">Attending Physician</th>
                <th class="p-3.5">Primary Diagnosis</th>
                <th class="p-3.5">Vital Signs (Latest)</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 pr-5 text-right">Chart Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                *ngFor="let p of filteredPatients()"
                (click)="state.openPatientModal(p)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td class="p-3.5 pl-5">
                  <div class="font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                    <span>{{ p.fullName }}</span>
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {{ p.gender === 'Female' ? 'F' : 'M' }}, {{ p.age }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">DOB: {{ p.dob }} • Blood: {{ p.bloodType }}</div>
                </td>

                <td class="p-3.5 font-mono text-slate-700">
                  <div class="font-bold text-slate-900">{{ p.mrn }}</div>
                  <div class="text-[10px] text-slate-400">{{ p.nationalId }}</div>
                </td>

                <td class="p-3.5">
                  <div class="font-bold font-mono text-slate-900">{{ p.bedNumber }}</div>
                  <div class="text-[11px] text-slate-500">{{ p.ward }}</div>
                </td>

                <td class="p-3.5">
                  <div class="font-medium text-slate-800">{{ p.attendingPhysician }}</div>
                  <div class="text-[10px] text-slate-400">{{ p.department }}</div>
                </td>

                <td class="p-3.5">
                  <div class="font-semibold text-slate-800 max-w-[200px] truncate" [title]="p.primaryDiagnosis">
                    {{ p.primaryDiagnosis }}
                  </div>
                  <div class="text-[10px] text-slate-400">
                    Allergies: {{ p.allergies.join(', ') }}
                  </div>
                </td>

                <td class="p-3.5 font-mono">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-900">{{ p.latestVitals.bloodPressure }}</span>
                    <span class="text-[10px] text-slate-400">BP</span>
                    <span class="text-slate-300">|</span>
                    <span class="font-bold text-slate-900">{{ p.latestVitals.heartRate }}</span>
                    <span class="text-[10px] text-slate-400">HR</span>
                  </div>
                  <div class="text-[11px] text-slate-500">
                    SpO2 {{ p.latestVitals.oxygenSaturation }}% • {{ p.latestVitals.temperature }}°C
                  </div>
                </td>

                <td class="p-3.5">
                  <app-patient-status-badge [status]="p.status"></app-patient-status-badge>
                </td>

                <td class="p-3.5 pr-5 text-right">
                  <button
                    class="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-sky-600 text-slate-700 group-hover:text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>View EHR</span>
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr *ngIf="filteredPatients().length === 0">
                <td colspan="8" class="p-8 text-center text-slate-400">
                  No matching inpatient records found matching your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class PatientListComponent {
  readonly state = inject(MedicalStateService);
  searchQuery = '';
  selectedWard: WardType | 'ALL' = 'ALL';
  selectedStatus: PatientStatus | 'ALL' = 'ALL';

  readonly filteredPatients = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    return this.state.patients().filter((patient) => {
      const matchesSearch =
        !q ||
        patient.fullName.toLowerCase().includes(q) ||
        patient.mrn.toLowerCase().includes(q) ||
        patient.bedNumber.toLowerCase().includes(q) ||
        patient.attendingPhysician.toLowerCase().includes(q);

      const matchesWard = this.selectedWard === 'ALL' || patient.ward === this.selectedWard;
      const matchesStatus = this.selectedStatus === 'ALL' || patient.status === this.selectedStatus;

      return matchesSearch && matchesWard && matchesStatus;
    });
  });
}
