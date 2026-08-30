import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalStateService } from '../../services/medical-state.service';
import { Patient, WardType, TriageLevel } from '../../types';

@Component({
  selector: 'app-new-admission-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="state.isNewAdmissionOpen()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div class="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        <!-- Header -->
        <div class="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-white">Inpatient Admission Registration Form</h2>
              <p class="text-xs text-slate-400">Complete demographic intake, insurance validation, and bed allocation</p>
            </div>
          </div>
          <button (click)="state.isNewAdmissionOpen.set(false)" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <!-- Form Body -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          <!-- Section 1: Demographics -->
          <div>
            <h3 class="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">1. Demographics & Identification</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                <input [(ngModel)]="fullName" placeholder="e.g. Maria Gonzalez" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Date of Birth (YYYY-MM-DD) *</label>
                <input [(ngModel)]="dob" placeholder="1985-06-14" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono" />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Gender & Blood Type</label>
                <div class="flex gap-2">
                  <select [(ngModel)]="gender" class="w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-2">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                  <select [(ngModel)]="bloodType" class="w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Clinical Details & Ward Bed -->
          <div class="pt-2 border-t border-slate-100">
            <h3 class="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">2. Clinical Admission & Bed Allocation</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="sm:col-span-2">
                <label class="font-semibold text-slate-700 block mb-1">Primary Admitting Diagnosis *</label>
                <input [(ngModel)]="diagnosis" placeholder="e.g. Acute Appendicitis with localized peritonitis" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Acuity Level (ESI)</label>
                <select [(ngModel)]="triageLevel" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-semibold">
                  <option [value]="1">ESI 1: Resuscitation</option>
                  <option [value]="2">ESI 2: Emergent</option>
                  <option [value]="3">ESI 3: Urgent</option>
                  <option [value]="4">ESI 4: Less Urgent</option>
                  <option [value]="5">ESI 5: Non-Urgent</option>
                </select>
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Assigned Ward *</label>
                <select [(ngModel)]="selectedWard" (change)="onWardChange()" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2">
                  <option value="Ward-A (Internal Med)">Ward-A (Internal Med)</option>
                  <option value="Ward-B (Cardiology)">Ward-B (Cardiology)</option>
                  <option value="ICU">Intensive Care Unit (ICU)</option>
                  <option value="Emergency (ED)">Emergency (ED)</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgical Recovery">Surgical Recovery</option>
                  <option value="Maternity">Maternity</option>
                </select>
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Bed Number *</label>
                <input [(ngModel)]="bedNumber" placeholder="e.g. A-104" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono" />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Attending Physician *</label>
                <input [(ngModel)]="attending" placeholder="e.g. Dr. Sarah Jenkins, MD" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
              </div>
            </div>
          </div>

          <!-- Section 3: Allergies & Emergency Contact -->
          <div class="pt-2 border-t border-slate-100">
            <h3 class="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">3. Allergies & Emergency Contact</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Allergies (comma-separated)</label>
                <input [(ngModel)]="allergiesStr" placeholder="e.g. Penicillin, Codeine, Latex" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">Emergency Contact (Name & Phone)</label>
                <input [(ngModel)]="emergencyContactStr" placeholder="e.g. Robert Gonzalez (Spouse) - (555) 302-8921" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2" />
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 flex-shrink-0">
          <button (click)="state.isNewAdmissionOpen.set(false)" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer">
            Cancel
          </button>
          <button (click)="submitAdmission()" class="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer">
            Complete Admission & Allocate Bed
          </button>
        </div>

      </div>
    </div>
  `
})
export class NewAdmissionModalComponent {
  readonly state = inject(MedicalStateService);

  fullName = '';
  dob = '1988-04-12';
  gender: 'Male' | 'Female' | 'Other' = 'Female';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' = 'O+';
  diagnosis = '';
  triageLevel: TriageLevel = 3;
  selectedWard: WardType = 'Ward-A (Internal Med)';
  bedNumber = 'A-104';
  attending = 'Dr. Sarah Jenkins, MD';
  allergiesStr = 'NKDA (No Known Drug Allergies)';
  emergencyContactStr = 'Carlos Gonzalez (Spouse) - (555) 201-9988';

  onWardChange() {
    if (this.selectedWard === 'ICU') this.bedNumber = 'ICU-03';
    else if (this.selectedWard === 'Ward-A (Internal Med)') this.bedNumber = 'A-104';
    else if (this.selectedWard === 'Ward-B (Cardiology)') this.bedNumber = 'B-203';
    else if (this.selectedWard === 'Pediatrics') this.bedNumber = 'PED-02';
    else if (this.selectedWard === 'Surgical Recovery') this.bedNumber = 'SURG-03';
  }

  submitAdmission() {
    if (!this.fullName || !this.diagnosis) {
      this.state.showToast('Please provide patient name and admitting diagnosis', 'alert');
      return;
    }

    const age = 2026 - parseInt(this.dob.split('-')[0] || '1990', 10);
    const mrn = String(Math.floor(100000 + Math.random() * 900000));
    const allergies = this.allergiesStr.split(',').map((s) => s.trim()).filter(Boolean);

    const newPatient: Patient = {
      id: `PAT-${Date.now()}`,
      mrn,
      nationalId: `NAT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      fullName: this.fullName,
      dob: this.dob,
      age: isNaN(age) ? 35 : age,
      gender: this.gender as any,
      bloodType: this.bloodType,
      phone: '+1 (555) 392-1082',
      email: `${this.fullName.toLowerCase().replace(/\s+/g, '.')}@patient-portal.medpulse.health`,
      allergies,
      primaryDiagnosis: this.diagnosis,
      department: this.selectedWard,
      ward: this.selectedWard,
      roomNumber: `Room ${this.bedNumber}`,
      bedNumber: this.bedNumber,
      attendingPhysician: this.attending,
      admissionDate: new Date().toISOString().split('T')[0],
      status: this.selectedWard === 'ICU' ? 'critical' : 'admitted',
      triageLevel: Number(this.triageLevel) as TriageLevel,
      latestVitals: {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bloodPressure: '120/80',
        heartRate: 72,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        temperature: 36.8,
        painScore: 2,
        recordedBy: this.state.currentUser().name,
      },
      vitalsHistory: [],
      clinicalNotes: [
        {
          id: `NOTE-${Date.now()}`,
          authorName: this.state.currentUser().name,
          authorRole: this.state.currentUser().roleTitle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          noteType: 'Progress Note',
          content: {
            subjective: `Patient presented for planned or emergent admission. Admitting diagnosis: ${this.diagnosis}.`,
            objective: `Physical exam unremarkable at intake. Vital signs stable.`,
            assessment: `Admission for ongoing hospital management and diagnostic workup.`,
            plan: `Admit to ${this.selectedWard}, initiate continuous monitoring, order baseline bloodwork.`,
          },
        },
      ],
      prescriptions: [],
      labResults: [],
      insurance: {
        provider: 'Blue Cross Blue Shield Regional',
        policyNumber: `BCBS-${Math.floor(10000000 + Math.random() * 90000000)}`,
        coverageStatus: 'Verified',
      },
      emergencyContact: {
        name: this.emergencyContactStr.split('-')[0] || 'Family Contact',
        relationship: 'Primary Contact',
        phone: this.emergencyContactStr.split('-')[1] || '(555) 000-0000',
      },
    };

    this.state.admitPatient(newPatient);
    this.state.isNewAdmissionOpen.set(false);
    this.fullName = '';
    this.diagnosis = '';
  }
}
