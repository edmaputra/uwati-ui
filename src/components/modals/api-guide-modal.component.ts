import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalStateService } from '../../services/medical-state.service';
import { FHIR_PATIENT_SCHEMA, API_CONTRACT_ENDPOINTS } from '../../data/mockData';

@Component({
  selector: 'app-api-guide-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="state.isApiGuideOpen()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div class="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        <!-- Header -->
        <div class="bg-indigo-950 text-white p-4 sm:p-5 border-b border-indigo-900 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-white">Backend Engineering & FHIR R4 API Contracts</h2>
              <p class="text-xs text-indigo-300">Specifications for REST, GraphQL, HL7 v2 / FHIR gateways, and WebSocket endpoints</p>
            </div>
          </div>
          <button (click)="state.isApiGuideOpen.set(false)" class="text-indigo-300 hover:text-white cursor-pointer">✕</button>
        </div>

        <!-- Body -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          <!-- Section 1: Endpoints List -->
          <div>
            <h3 class="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
              RESTful Microservice Endpoints
            </h3>
            <div class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div *ngFor="let ep of endpoints" class="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded font-mono font-bold text-[10px]"
                    [ngClass]="ep.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'"
                  >
                    {{ ep.method }}
                  </span>
                  <code class="font-mono text-slate-900 font-bold">{{ ep.path }}</code>
                </div>
                <div class="text-slate-500 text-right text-[11px]">{{ ep.description }}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: HL7 FHIR R4 Patient Resource JSON -->
          <div>
            <h3 class="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
              HL7 FHIR R4 Schema Standard Payload Example
            </h3>
            <div class="bg-slate-950 text-sky-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
              <pre>{{ fhirSchemaJson }}</pre>
            </div>
          </div>

          <!-- Section 3: Telemetry Stream Architecture -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 class="font-bold text-slate-900 text-xs">Real-Time Telemetry & WebSocket Contract</h4>
            <p class="text-slate-600 leading-relaxed">
              Continuous vitals streams are received via <code class="bg-slate-200 px-1 py-0.5 rounded font-mono">wss://api.medpulse.health/v1/telemetry/stream</code>. Every 3 seconds, bedside monitors push payload containing ECG wave packets, SpO2 pulse plethysmograph, and instantaneous alarms.
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end flex-shrink-0">
          <button (click)="state.isApiGuideOpen.set(false)" class="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer">
            Close Architecture Guide
          </button>
        </div>

      </div>
    </div>
  `
})
export class ApiGuideModalComponent {
  readonly state = inject(MedicalStateService);
  readonly endpoints = API_CONTRACT_ENDPOINTS;
  readonly fhirSchemaJson = JSON.stringify(FHIR_PATIENT_SCHEMA, null, 2);
}
