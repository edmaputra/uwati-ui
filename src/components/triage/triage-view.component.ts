import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalStateService } from '../../services/medical-state.service';
import { TriageBadgeComponent } from '../common/medical-badges.component';
import { TriageQueueItem, TriageLevel, TriageZone } from '../../types';

@Component({
  selector: 'app-triage-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TriageBadgeComponent],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Header Banner -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Emergency Department Triage & Acuity Queue</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Emergency Severity Index (ESI) 5-level sorting • Real-time waiting telemetry
          </p>
        </div>

        <button
          (click)="showNewTriageForm = !showNewTriageForm"
          class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Triage Walk-in / Ambulance</span>
        </button>
      </div>

      <!-- New Triage Registration Form (Toggleable) -->
      <div *ngIf="showNewTriageForm" class="bg-white p-5 rounded-2xl border-2 border-rose-300 shadow-lg space-y-4 animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 class="font-bold text-slate-900 text-sm">Emergency Patient Intake & Triage Assessment</h2>
          <button (click)="showNewTriageForm = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Patient Full Name</label>
            <input [(ngModel)]="formName" placeholder="e.g. John Doe" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Age & Gender</label>
            <div class="flex gap-2">
              <input type="number" [(ngModel)]="formAge" placeholder="Age" class="w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono" />
              <select [(ngModel)]="formGender" class="w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-2">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">ESI Triage Acuity Level</label>
            <select [(ngModel)]="formTriageLevel" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold">
              <option [value]="1">ESI 1: Resuscitation (STAT Immediate)</option>
              <option [value]="2">ESI 2: Emergent (High Risk / Confusion)</option>
              <option [value]="3">ESI 3: Urgent (Multiple resources)</option>
              <option [value]="4">ESI 4: Less Urgent (One resource)</option>
              <option [value]="5">ESI 5: Non-Urgent (No resources)</option>
            </select>
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Arrival Transport Mode</label>
            <select [(ngModel)]="formArrivalMode" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2">
              <option value="Ambulance / EMS">Ambulance / EMS</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Hospital Transfer">Hospital Transfer</option>
              <option value="Helicopter Medevac">Helicopter Medevac</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="font-semibold text-slate-700 block mb-1">Chief Complaint</label>
            <input [(ngModel)]="formComplaint" placeholder="e.g. Acute severe chest pain radiating to left jaw..." class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Triage Vitals Summary</label>
            <input [(ngModel)]="formVitals" placeholder="e.g. BP 145/95, HR 104, SpO2 96%" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono" />
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Assigned Zone</label>
            <select [(ngModel)]="formZone" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2">
              <option value="Resuscitation Bay">Resuscitation Bay</option>
              <option value="Acute Care">Acute Care</option>
              <option value="Sub-Acute">Sub-Acute</option>
              <option value="Fast Track">Fast Track</option>
              <option value="Waiting Room">Waiting Room</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button (click)="showNewTriageForm = false" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
          <button (click)="submitTriage()" class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">Commit Triage Entry</button>
        </div>
      </div>

      <!-- Triage Queue Table / Cards -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Sorted by Acuity Level & Wait Time</span>
            <span class="font-mono text-slate-400">({{ state.triageQueue().length }} total active)</span>
          </div>
        </div>

        <div class="divide-y divide-slate-100">
          <div
            *ngFor="let item of sortedTriageQueue()"
            class="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-4">
              <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 border border-slate-200 min-w-[72px] text-center font-mono">
                <span class="text-[10px] text-slate-500 uppercase font-bold">Waiting</span>
                <span class="text-lg font-black" [ngClass]="item.waitingMinutes > 30 ? 'text-rose-600' : 'text-slate-800'">
                  {{ item.waitingMinutes }}m
                </span>
              </div>

              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <app-triage-badge [level]="item.triageLevel" size="md"></app-triage-badge>
                  <span class="font-bold text-sm text-slate-900">{{ item.patientName }}</span>
                  <span class="text-xs text-slate-400 font-mono">({{ item.age }}y, {{ item.gender }})</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{{ item.arrivalMode }}</span>
                </div>
                <div class="text-xs font-semibold text-slate-800">{{ item.chiefComplaint }}</div>
                <div class="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-x-3">
                  <span>Vitals: <strong>{{ item.vitalsSummary }}</strong></span>
                  <span>•</span>
                  <span>Zone: <strong>{{ item.assignedZone }}</strong></span>
                  <span>•</span>
                  <span>Triage Nurse: {{ item.triageNurse }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
              <button
                *ngIf="item.status === 'waiting_doctor'"
                (click)="state.updateTriageStatus(item.id, 'with_doctor')"
                class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Call to Exam Room
              </button>

              <button
                *ngIf="item.status === 'with_doctor'"
                (click)="state.updateTriageStatus(item.id, 'disposition_pending')"
                class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Disposition / Admit
              </button>

              <button
                *ngIf="item.status === 'disposition_pending'"
                (click)="state.updateTriageStatus(item.id, 'admitted_or_discharged')"
                class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Complete Triage Encounter
              </button>
            </div>
          </div>

          <div *ngIf="state.triageQueue().length === 0" class="p-8 text-center text-slate-400 text-xs">
            Emergency department triage queue is currently clear.
          </div>
        </div>
      </div>

    </div>
  `
})
export class TriageViewComponent {
  readonly state = inject(MedicalStateService);
  showNewTriageForm = false;

  formName = '';
  formAge = 45;
  formGender: 'Male' | 'Female' | 'Other' = 'Female';
  formTriageLevel: TriageLevel = 2;
  formComplaint = '';
  formArrivalMode = 'Walk-in';
  formVitals = 'BP 130/85, HR 88, SpO2 98%';
  formZone: TriageZone = 'Acute Care';

  readonly sortedTriageQueue = computed(() => {
    return [...this.state.triageQueue()].sort((a, b) => {
      if (a.triageLevel !== b.triageLevel) return a.triageLevel - b.triageLevel;
      return b.waitingMinutes - a.waitingMinutes;
    });
  });

  submitTriage() {
    if (!this.formName || !this.formComplaint) {
      this.state.showToast('Please enter patient name and chief complaint', 'alert');
      return;
    }

    const newItem: TriageQueueItem = {
      id: `TR-${Date.now()}`,
      patientName: this.formName,
      age: Number(this.formAge),
      gender: this.formGender,
      triageLevel: Number(this.formTriageLevel) as TriageLevel,
      chiefComplaint: this.formComplaint,
      arrivalMode: this.formArrivalMode,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitingMinutes: 1,
      vitalsSummary: this.formVitals,
      assignedZone: this.formZone,
      triageNurse: this.state.currentUser().name,
      status: 'waiting_doctor',
    };

    this.state.addTriagePatient(newItem);
    this.showNewTriageForm = false;
    this.formName = '';
    this.formComplaint = '';
  }
}
