import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalStateService } from '../../services/medical-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      
      <!-- Top Navigation Links -->
      <div class="p-4 space-y-6">
        
        <!-- Navigation Section -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Clinical Operations
          </div>
          <nav class="space-y-1">
            
            <button
              (click)="state.setTab('dashboard')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'dashboard' ? 'bg-sky-50 text-sky-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'dashboard' ? 'text-sky-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Operations Dashboard</span>
              </div>
            </button>

            <button
              (click)="state.setTab('patients')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'patients' ? 'bg-sky-50 text-sky-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'patients' ? 'text-sky-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Patients & EHR</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                [ngClass]="state.currentTab() === 'patients' ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-600'"
              >
                {{ state.patients().length }}
              </span>
            </button>

            <button
              (click)="state.setTab('triage')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'triage' ? 'bg-rose-50 text-rose-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'triage' ? 'text-rose-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Emergency Triage</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                {{ triagePendingCount() }}
              </span>
            </button>

            <button
              (click)="state.setTab('beds')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'beds' ? 'bg-sky-50 text-sky-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'beds' ? 'text-sky-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Ward Beds Matrix</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                {{ unassignedBedCount() }} Free
              </span>
            </button>

            <button
              (click)="state.setTab('pharmacy')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'pharmacy' ? 'bg-sky-50 text-sky-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'pharmacy' ? 'text-sky-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span>Pharmacy Dispense</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                {{ pendingRxCount() }}
              </span>
            </button>

            <button
              (click)="state.setTab('diagnostics')"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
              [ngClass]="state.currentTab() === 'diagnostics' ? 'bg-sky-50 text-sky-800 shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-4 h-4" [ngClass]="state.currentTab() === 'diagnostics' ? 'text-sky-600' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Diagnostics & PACS</span>
              </div>
            </button>

          </nav>
        </div>

        <!-- System Architecture & Developer Reference -->
        <div>
          <div class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Engineering & Specs
          </div>
          <button
            (click)="state.isApiGuideOpen.set(true)"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50/80 text-indigo-900 border border-indigo-200/80 hover:bg-indigo-100 transition-colors cursor-pointer text-left"
          >
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>API Contracts & Tokens</span>
            </div>
            <span class="text-[10px] font-bold font-mono text-indigo-600">FHIR</span>
          </button>
        </div>

      </div>

      <!-- Footer Info -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-[11px] space-y-1">
          <div class="flex items-center justify-between font-semibold text-slate-700">
            <span>HIS Connection</span>
            <span class="flex items-center gap-1 text-emerald-700">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              HL7 Live
            </span>
          </div>
          <p class="text-[10px] text-slate-400 font-mono">Telemetry polling: 3.5s</p>
        </div>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  readonly state = inject(MedicalStateService);

  readonly triagePendingCount = computed(() =>
    this.state.triageQueue().filter((t) => t.status === 'waiting_doctor').length
  );

  readonly unassignedBedCount = computed(() =>
    this.state.beds().filter((b) => b.status === 'available').length
  );

  readonly pendingRxCount = computed(() =>
    this.state.pharmacyOrders().filter((o) => o.status === 'pending').length
  );
}
