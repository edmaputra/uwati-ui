import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalStateService } from '../../services/medical-state.service';
import { INITIAL_STAFF_PROFILES } from '../../data/mockData';
import { CurrentUser } from '../../types';

@Component({
  selector: 'app-login-portal',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      
      <!-- Background Ambient Grid & Radial Medical Glow -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70 pointer-events-none"></div>
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header Banner -->
      <header class="relative z-10 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-6 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold tracking-tight text-lg text-white">MedPulse HIS</span>
                <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">CLINICAL GATEWAY v4.2</span>
              </div>
              <p class="text-[11px] text-slate-400 font-mono tracking-wide">ST. JUDE REGIONAL MEDICAL CENTER • SECURE WORKSTATION ACCESS</p>
            </div>
          </div>

          <!-- System Status Telemetry -->
          <div class="hidden sm:flex items-center gap-6 text-xs text-slate-400 font-mono">
            <div class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-emerald-400 font-medium">EMR CORE: ONLINE</span>
            </div>
            <div class="hidden md:flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>TLS 1.3 / AES-256</span>
            </div>
            <div>
              <span>NODE: <strong>STJ-ED-809</strong></span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Login Container -->
      <main class="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Left Col: Hospital Branding & Clinical Staff Switcher (5 cols) -->
          <div class="lg:col-span-5 bg-gradient-to-br from-slate-900/90 to-slate-950/95 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <!-- Decorative corner glow -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div class="space-y-6">
              <div class="space-y-2">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>HIPAA & HITECH Compliant</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Clinical Staff Authentication
                </h1>
                <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Authorized healthcare staff access only. All patient chart access and order entries are cryptographically signed and audited per institutional compliance standards.
                </p>
              </div>

              <!-- Quick Demo Staff Selector -->
              <div class="space-y-2.5 pt-2">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">1-Click Fast Credentials</span>
                  <span class="text-[10px] text-sky-400 font-mono">Demo Roster</span>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  @for (roleKey of demoRoleKeys; track roleKey) {
                    @let prof = profiles[roleKey];
                    <button
                      type="button"
                      (click)="populateQuickCredentials(roleKey)"
                      class="w-full text-left p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-sky-500/20 text-slate-300 group-hover:text-sky-300 flex items-center justify-center text-xs font-bold font-mono transition-colors">
                          {{ prof.role.substring(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition-colors">{{ prof.name }}</div>
                          <div class="text-[10px] text-slate-400">{{ prof.roleTitle }}</div>
                        </div>
                      </div>
                      <span class="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 px-2 py-0.5 rounded bg-slate-800/80">
                        {{ prof.id }}
                      </span>
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Compliance Footer Notice -->
            <div class="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
              <div class="flex items-center gap-1.5 text-slate-400">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="font-semibold text-slate-300">Security Warning</span>
              </div>
              <p>Unauthorized access to protected health information (PHI) is subject to federal penalties under 45 CFR Part 160.</p>
            </div>
          </div>

          <!-- Right Col: Secure Authentication Form (7 cols) -->
          <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div>
                  <h2 class="text-xl font-bold text-white tracking-tight">Staff Sign In</h2>
                  <p class="text-xs text-slate-400">Enter hospital credentials or employee badge ID</p>
                </div>
                <div class="w-9 h-9 rounded-2xl bg-sky-950 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>

              <!-- Login Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4" id="loginForm">
                
                <!-- Employee ID Field -->
                <div>
                  <label for="employeeId" class="block text-xs font-semibold text-slate-300 mb-1.5">
                    Employee ID / National Provider Identifier (NPI)
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="employeeId"
                      type="text"
                      formControlName="employeeId"
                      placeholder="e.g. DOC-1092, NUR-4021, ADM-0081"
                      class="w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                      [class.border-slate-700]="!isFieldInvalid('employeeId')"
                      [class.border-rose-500]="isFieldInvalid('employeeId')"
                      [class.bg-rose-950/20]="isFieldInvalid('employeeId')"
                    />
                  </div>
                  @if (isFieldInvalid('employeeId')) {
                    <p class="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                      <span>✕</span> Valid Employee ID is required (e.g. DOC-1092)
                    </p>
                  }
                </div>

                <!-- Password Field with Show/Hide -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label for="password" class="block text-xs font-semibold text-slate-300">
                      Workstation Password / PIN
                    </label>
                    <button
                      type="button"
                      (click)="onForgotPassword()"
                      class="text-[11px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer hover:underline"
                    >
                      Reset Credentials
                    </button>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      placeholder="••••••••••••"
                      class="w-full bg-slate-950 border rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                      [class.border-slate-700]="!isFieldInvalid('password')"
                      [class.border-rose-500]="isFieldInvalid('password')"
                      [class.bg-rose-950/20]="isFieldInvalid('password')"
                    />
                    <button
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                      title="Toggle password visibility"
                    >
                      @if (showPassword()) {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      } @else {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      }
                    </button>
                  </div>
                  @if (isFieldInvalid('password')) {
                    <p class="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                      <span>✕</span> Password must be at least 4 characters
                    </p>
                  }
                </div>

                <!-- Workstation Unit / Department Selector -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="departmentUnit" class="block text-xs font-semibold text-slate-300 mb-1.5">
                      Assigned Ward / Station
                    </label>
                    <select
                      id="departmentUnit"
                      formControlName="departmentUnit"
                      class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      <option value="Cardiology / Internal Medicine">Cardiology / Internal Med</option>
                      <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                      <option value="Emergency Medicine (ED)">Emergency Medicine (ED)</option>
                      <option value="Central Inpatient Pharmacy">Central Inpatient Pharmacy</option>
                      <option value="Executive Administration">Executive Administration</option>
                    </select>
                  </div>

                  <div>
                    <label for="shiftType" class="block text-xs font-semibold text-slate-300 mb-1.5">
                      Shift Schedule
                    </label>
                    <select
                      id="shiftType"
                      formControlName="shiftType"
                      class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      <option value="Morning (07:00 - 15:30)">Morning Shift (07:00 - 15:30)</option>
                      <option value="Day Shift (06:30 - 18:30)">Day 12h Shift (06:30 - 18:30)</option>
                      <option value="Emergency Swing (14:00 - 02:00)">Swing Shift (14:00 - 02:00)</option>
                      <option value="Night Shift (19:00 - 07:30)">Night 12h Shift (19:00 - 07:30)</option>
                    </select>
                  </div>
                </div>

                <!-- 2FA Hardware Token / Smart Badge Toggle & Scan -->
                <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-slate-200">Smart Badge / YubiKey 2FA</div>
                      <div class="text-[10px] text-slate-400">NFC RFID sensor ready for physical badge tap</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="simulateBadgeTap()"
                      class="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono border border-slate-700 cursor-pointer"
                    >
                      Tap Badge
                    </button>
                    <input
                      type="checkbox"
                      formControlName="hardwareTokenVerified"
                      id="hardwareToken"
                      class="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-700 focus:ring-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                <!-- Error Message Banner -->
                @if (authError()) {
                  <div class="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <svg class="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ authError() }}</span>
                  </div>
                }

                <!-- Submit Action Button -->
                <button
                  type="submit"
                  [disabled]="isSubmitting()"
                  class="w-full mt-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm shadow-lg shadow-sky-900/40 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  @if (isSubmitting()) {
                    <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying Clinical Key & Credentials...</span>
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Authenticate & Open Workstation</span>
                  }
                </button>

              </form>
            </div>

            <!-- Portal Badges & Interoperability -->
            <div class="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
              <div class="flex items-center gap-3">
                <span>HL7® FHIR® R4</span>
                <span>•</span>
                <span>DICOM 3.0</span>
                <span>•</span>
                <span>SNOMED CT</span>
              </div>
              <div class="flex items-center gap-1.5 text-slate-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>STJ-GATEWAY v4.2.0</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <!-- Institutional Footer -->
      <footer class="relative z-10 border-t border-slate-800/60 bg-slate-900/40 px-6 py-3 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 St. Jude Regional Medical Center & MedPulse HIS Corporation. All rights reserved.
          </div>
          <div class="flex items-center gap-4 text-slate-400 text-[11px]">
            <a href="javascript:void(0)" (click)="state.showToast('Contact IT Clinical Desk at ext #4900', 'info')" class="hover:text-slate-200">IT Helpdesk: ext #4900</a>
            <span>•</span>
            <a href="javascript:void(0)" (click)="state.showToast('Security audit log active for IP 10.42.18.9', 'info')" class="hover:text-slate-200">Audit Protocol</a>
            <span>•</span>
            <a href="javascript:void(0)" (click)="state.showToast('HIPAA Security rule 45 CFR Part 160 enforced', 'info')" class="hover:text-slate-200">Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LoginPortalComponent {
  readonly state = inject(MedicalStateService);
  private readonly router = inject(Router);
  
  readonly profiles = INITIAL_STAFF_PROFILES;
  readonly demoRoleKeys = Object.keys(INITIAL_STAFF_PROFILES) as (keyof typeof INITIAL_STAFF_PROFILES)[];

  readonly showPassword = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly authError = signal<string | null>(null);

  readonly loginForm = new FormGroup({
    employeeId: new FormControl('DOC-1092', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('medpulse@secure2026', [Validators.required, Validators.minLength(4)]),
    departmentUnit: new FormControl('Cardiology / Internal Medicine'),
    shiftType: new FormControl('Morning (07:00 - 15:30)'),
    hardwareTokenVerified: new FormControl(true),
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  populateQuickCredentials(roleKey: string) {
    const prof = this.profiles[roleKey];
    if (prof) {
      this.loginForm.patchValue({
        employeeId: prof.id,
        password: `medpulse@${prof.role}2026`,
        departmentUnit: prof.department,
        shiftType: prof.shift,
        hardwareTokenVerified: true,
      });
      this.authError.set(null);
      this.state.showToast(`Loaded credentials for ${prof.name} (${prof.id})`, 'info');
    }
  }

  simulateBadgeTap() {
    this.loginForm.patchValue({ hardwareTokenVerified: true });
    this.state.showToast('NFC Badge read successfully: RFID UID #984-21-STJ', 'info');
  }

  onForgotPassword() {
    this.state.showToast('For clinical password resets, contact the Hospital Informatics Desk at (555) 019-4900 or tap smart badge.', 'alert');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.authError.set('Please provide a valid Employee ID and Password.');
      return;
    }

    const { employeeId, departmentUnit, shiftType } = this.loginForm.value;
    this.isSubmitting.set(true);
    this.authError.set(null);

    // Simulate cryptographic workstation authentication & token exchange
    setTimeout(() => {
      this.isSubmitting.set(false);

      // Find if matching profile in mock profiles
      const matchedKey = Object.keys(this.profiles).find(
        k => this.profiles[k].id.toLowerCase() === (employeeId || '').toLowerCase()
      );

      if (matchedKey) {
        const userProfile = {
          ...this.profiles[matchedKey],
          department: departmentUnit || this.profiles[matchedKey].department,
          shift: shiftType || this.profiles[matchedKey].shift,
        };
        this.state.login(userProfile);
      } else {
        // Fallback for custom employee ID login
        const customUser: CurrentUser = {
          id: employeeId?.toUpperCase() || 'EMP-7701',
          name: `Staff Member (${employeeId})`,
          role: 'physician',
          roleTitle: 'Clinical Specialist',
          department: departmentUnit || 'General Medicine',
          licenseNumber: 'LIC-48190-STJ',
          shift: shiftType || 'Morning (07:00 - 15:30)',
        };
        this.state.login(customUser);
      }

      this.router.navigate(['/dashboard']);
    }, 650);
  }
}
