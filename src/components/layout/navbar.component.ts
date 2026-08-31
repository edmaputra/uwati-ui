import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalStateService } from '../../services/medical-state.service';
import { Patient } from '../../types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Left: Brand & Emergency Indicator -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-black tracking-tight text-base text-white">MedPulse</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">ANGULAR HIS v4</span>
              </div>
              <p class="text-[10px] text-slate-400 font-mono leading-none">ST. JUDE REGIONAL MEDICAL CENTER</p>
            </div>
          </div>
        </div>

        <!-- Center: Omni-Search Bar -->
        <div class="flex-1 max-w-md relative hidden md:block">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (focus)="showSearchDropdown = true"
              placeholder="Omni-Search by Patient Name, MRN (e.g. 849201), Bed, or Doctor..."
              class="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-sans"
            />
            <button
              *ngIf="searchQuery"
              (click)="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          <!-- Dropdown Results -->
          <div
            *ngIf="searchQuery && showSearchDropdown"
            class="absolute top-full mt-1.5 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-xs"
          >
            <div class="p-2 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Matching Inpatients ({{ filteredPatients().length }})
            </div>
            <div class="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
              <button
                *ngFor="let p of filteredPatients()"
                (click)="onSelectPatient(p)"
                class="w-full text-left p-3 hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div class="font-bold text-slate-100 group-hover:text-sky-400 transition-colors">{{ p.fullName }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{{ p.mrn }} • {{ p.ward }} ({{ p.bedNumber }})</div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
                    [ngClass]="{
                      'bg-rose-500/20 text-rose-300': p.status === 'critical',
                      'bg-sky-500/20 text-sky-300': p.status === 'admitted',
                      'bg-amber-500/20 text-amber-300': p.status === 'observation',
                      'bg-slate-500/20 text-slate-300': p.status === 'discharged'
                    }"
                  >
                    {{ p.status }}
                  </span>
                  <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">{{ p.primaryDiagnosis }}</div>
                </div>
              </button>
              <div *ngIf="filteredPatients().length === 0" class="p-4 text-center text-slate-400">
                No matching patients found for "{{ searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Role Selector & Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          <!-- Backend API Contracts Modal Button -->
          <button
            (click)="state.isApiGuideOpen.set(true)"
            class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="View API Contracts & FHIR schemas for backend engineers"
          >
            <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Backend APIs</span>
          </button>

          <!-- New Admission Quick Button -->
          <button
            (click)="state.isNewAdmissionOpen.set(true)"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span class="hidden sm:inline">Admit Inpatient</span>
            <span class="sm:hidden">Admit</span>
          </button>

          <!-- Active Staff Switcher Dropdown -->
          <div class="relative">
            <button
              (click)="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 transition-colors cursor-pointer text-left"
            >
              <div class="w-7 h-7 rounded-lg bg-slate-700 text-sky-400 font-bold flex items-center justify-center text-xs ring-1 ring-white/10 font-mono">
                {{ userInitials() }}
              </div>
              <div class="hidden lg:block">
                <div class="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  <span>{{ state.currentUser().name.split(',')[0] }}</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div class="text-[10px] text-slate-400 leading-tight">{{ state.currentUser().roleTitle }}</div>
              </div>
            </button>

            <!-- Role Dropdown -->
            <div
              *ngIf="showUserMenu"
              class="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs text-slate-200 divide-y divide-slate-800"
            >
              <div class="p-2">
                <div class="text-[10px] font-bold uppercase text-slate-400">Current Station</div>
                <div class="font-bold text-white text-sm">{{ state.currentUser().name }}</div>
                <div class="text-slate-400 text-xs">{{ state.currentUser().department }} • ID: {{ state.currentUser().id }}</div>
              </div>

              <div class="py-2">
                <div class="text-[10px] font-bold uppercase text-slate-400 px-2 mb-1">Switch Workstation Role</div>
                <button
                  (click)="selectRole('physician')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                  [ngClass]="{'bg-sky-500/20 text-sky-300 font-bold': state.currentUser().role === 'physician'}"
                >
                  <span>Attending Physician</span>
                  <span class="text-[10px] font-mono opacity-60">Dr. Jenkins</span>
                </button>
                <button
                  (click)="selectRole('nurse')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                  [ngClass]="{'bg-sky-500/20 text-sky-300 font-bold': state.currentUser().role === 'nurse'}"
                >
                  <span>Charge Nurse</span>
                  <span class="text-[10px] font-mono opacity-60">Elena Rostova</span>
                </button>
                <button
                  (click)="selectRole('pharmacist')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                  [ngClass]="{'bg-sky-500/20 text-sky-300 font-bold': state.currentUser().role === 'pharmacist'}"
                >
                  <span>Clinical Pharmacist</span>
                  <span class="text-[10px] font-mono opacity-60">Marcus Vance</span>
                </button>
                <button
                  (click)="selectRole('triage_officer')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                  [ngClass]="{'bg-sky-500/20 text-sky-300 font-bold': state.currentUser().role === 'triage_officer'}"
                >
                  <span>ER Triage Officer</span>
                  <span class="text-[10px] font-mono opacity-60">Officer Diaz</span>
                </button>
                <button
                  (click)="selectRole('admin')"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer"
                  [ngClass]="{'bg-sky-500/20 text-sky-300 font-bold': state.currentUser().role === 'admin'}"
                >
                  <span>Hospital Administrator</span>
                  <span class="text-[10px] font-mono opacity-60">Dr. Thorne</span>
                </button>
              </div>

              <div class="pt-2">
                <button
                  (click)="logout()"
                  class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out Workstation</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly state = inject(MedicalStateService);
  private readonly router = inject(Router);
  searchQuery = '';
  showSearchDropdown = false;
  showUserMenu = false;

  readonly filteredPatients = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return [];
    return this.state.patients().filter(
      p =>
        p.fullName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.bedNumber.toLowerCase().includes(q) ||
        p.attendingPhysician.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q)
    );
  });

  readonly userInitials = computed(() => {
    const name = this.state.currentUser().name;
    const parts = name.replace('Dr. ', '').split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  });

  onSelectPatient(patient: Patient) {
    this.state.openPatientModal(patient);
    this.searchQuery = '';
    this.showSearchDropdown = false;
  }

  selectRole(role: any) {
    this.state.switchRole(role);
    this.showUserMenu = false;
  }

  logout() {
    this.showUserMenu = false;
    this.state.logout();
    this.router.navigate(['/login']);
  }
}
