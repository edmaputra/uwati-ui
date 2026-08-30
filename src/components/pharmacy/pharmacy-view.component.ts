import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalStateService } from '../../services/medical-state.service';

@Component({
  selector: 'app-pharmacy-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Top Banner -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Hospital Central Pharmacy & Medication Dispense Unit</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Clinical Pharmacist verification, drug interaction checking, and automated Pyxis dispensing
          </p>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Active Inpatient Medication Orders Queue ({{ state.pharmacyOrders().length }})</span>
          <span class="text-indigo-600 font-mono">Pharmacist Verification: Required</span>
        </div>

        <div class="divide-y divide-slate-100">
          <div
            *ngFor="let order of state.pharmacyOrders()"
            class="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase"
                  [ngClass]="order.priority === 'STAT' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'"
                >
                  {{ order.priority }}
                </span>
                <span class="font-bold text-sm text-slate-900">{{ order.medicationName }}</span>
                <span class="text-xs text-slate-600 font-mono">({{ order.dosage }} • {{ order.route }})</span>
                <span
                  class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                  [ngClass]="order.status === 'dispensed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                >
                  {{ order.status }}
                </span>
              </div>

              <div class="text-xs text-slate-700">
                Patient: <strong class="text-slate-900">{{ order.patientName }}</strong> (MRN: {{ order.mrn }}) • {{ order.ward }} ({{ order.bedNumber }})
              </div>

              <div class="text-[11px] text-slate-500 font-mono">
                Prescribed by {{ order.prescriber }} • Ordered at {{ order.orderedAt }}
              </div>
            </div>

            <div class="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
              <button
                *ngIf="order.status === 'pending'"
                (click)="state.dispenseOrder(order.id, order.medicationName)"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Verify & Dispense
              </button>

              <span
                *ngIf="order.status === 'dispensed'"
                class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
              >
                ✓ Dispensed to Ward
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class PharmacyViewComponent {
  readonly state = inject(MedicalStateService);
}
