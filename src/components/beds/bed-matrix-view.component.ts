import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalStateService } from '../../services/medical-state.service';
import { BedStatusBadgeComponent } from '../common/medical-badges.component';
import { Bed, WardType, BedStatus } from '../../types';

@Component({
  selector: 'app-bed-matrix-view',
  standalone: true,
  imports: [CommonModule, FormsModule, BedStatusBadgeComponent],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Top Header -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Hospital Inpatient Bed Matrix & Ward Census</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Real-time occupancy tracking, terminal cleaning workflows, and bed turnaround management
          </p>
        </div>

        <!-- Filter Ward -->
        <div class="flex items-center gap-2 text-xs">
          <label class="font-semibold text-slate-600">Filter Ward:</label>
          <select [(ngModel)]="filterWard" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-sans">
            <option value="ALL">All Wards ({{ state.beds().length }} beds)</option>
            <option value="ICU">Intensive Care Unit (ICU)</option>
            <option value="Emergency (ED)">Emergency Department (ED)</option>
            <option value="Ward-A (Internal Med)">Ward-A (Internal Med)</option>
            <option value="Ward-B (Cardiology)">Ward-B (Cardiology)</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Surgical Recovery">Surgical Recovery</option>
            <option value="Maternity">Maternity</option>
          </select>
        </div>
      </div>

      <!-- Quick Legend & Summary Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="text-[11px] text-slate-500 font-medium">Available (Clean)</div>
          <div class="text-xl font-bold font-mono text-emerald-700 mt-1">{{ countByStatus('available') }}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="text-[11px] text-slate-500 font-medium">Occupied</div>
          <div class="text-xl font-bold font-mono text-indigo-700 mt-1">{{ countByStatus('occupied') }}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="text-[11px] text-slate-500 font-medium">Sanitizing / Cleaning</div>
          <div class="text-xl font-bold font-mono text-amber-700 mt-1">{{ countByStatus('cleaning') }}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="text-[11px] text-slate-500 font-medium">Reserved</div>
          <div class="text-xl font-bold font-mono text-purple-700 mt-1">{{ countByStatus('reserved') }}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div class="text-[11px] text-slate-500 font-medium">Maintenance / Out</div>
          <div class="text-xl font-bold font-mono text-slate-600 mt-1">{{ countByStatus('maintenance') }}</div>
        </div>
      </div>

      <!-- Bed Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          *ngFor="let bed of filteredBeds()"
          class="bg-white rounded-2xl border transition-all p-4 space-y-3 shadow-xs hover:shadow-md"
          [ngClass]="{
            'border-emerald-300 ring-1 ring-emerald-100': bed.status === 'available',
            'border-indigo-300 ring-1 ring-indigo-100': bed.status === 'occupied',
            'border-amber-300 ring-1 ring-amber-100': bed.status === 'cleaning',
            'border-slate-200': bed.status === 'maintenance' || bed.status === 'reserved'
          }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-base font-black font-mono text-slate-900">{{ bed.code }}</span>
              <span class="text-[11px] text-slate-400 block">{{ bed.ward }}</span>
            </div>
            <app-bed-status-badge [status]="bed.status"></app-bed-status-badge>
          </div>

          <!-- Patient Information or Bed Availability -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs min-h-[64px] flex flex-col justify-center">
            <div *ngIf="bed.status === 'occupied'">
              <div class="font-bold text-slate-900 truncate">{{ bed.patientName }}</div>
              <div class="text-[11px] text-slate-500 font-mono mt-0.5">MRN: {{ bed.patientMrn }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Admitted: {{ bed.admissionDate }}</div>
            </div>

            <div *ngIf="bed.status === 'available'" class="text-center text-emerald-700 font-medium">
              Ready for immediate Inpatient / ER Transfer
            </div>

            <div *ngIf="bed.status === 'cleaning'" class="text-center text-amber-800 font-medium flex items-center justify-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Terminal Sanitation in Progress
            </div>

            <div *ngIf="bed.status === 'reserved'" class="text-center text-purple-800 font-medium">
              Reserved for Post-Op Transfer
            </div>

            <div *ngIf="bed.status === 'maintenance'" class="text-center text-slate-500">
              Biomedical Engineering Service
            </div>
          </div>

          <!-- Bed Quick Actions -->
          <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
            
            <button
              *ngIf="bed.status === 'cleaning'"
              (click)="markClean(bed.id, bed.code)"
              class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Verify Clean & Ready
            </button>

            <button
              *ngIf="bed.status === 'available'"
              (click)="state.isNewAdmissionOpen.set(true)"
              class="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Assign Patient
            </button>

            <button
              *ngIf="bed.status === 'occupied'"
              (click)="findAndOpenPatient(bed.patientMrn)"
              class="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Open Patient EHR
            </button>

            <button
              *ngIf="bed.status === 'maintenance'"
              (click)="state.updateBedStatus(bed.id, 'cleaning')"
              class="w-full py-1.5 bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Send to Sanitation
            </button>

          </div>

        </div>
      </div>

    </div>
  `
})
export class BedMatrixViewComponent {
  readonly state = inject(MedicalStateService);
  filterWard: WardType | 'ALL' = 'ALL';

  readonly filteredBeds = computed(() => {
    if (this.filterWard === 'ALL') return this.state.beds();
    return this.state.beds().filter((b) => b.ward === this.filterWard);
  });

  countByStatus(status: BedStatus): number {
    return this.state.beds().filter((b) => b.status === status).length;
  }

  markClean(id: string, code: string) {
    this.state.updateBedStatus(id, 'available');
    this.state.showToast(`Bed ${code} verified clean and marked AVAILABLE for admission`, 'success');
  }

  findAndOpenPatient(mrn?: string) {
    if (!mrn) return;
    const p = this.state.patients().find((item) => item.mrn === mrn);
    if (p) {
      this.state.openPatientModal(p);
    }
  }
}
