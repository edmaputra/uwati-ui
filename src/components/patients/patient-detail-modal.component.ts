import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalStateService } from '../../services/medical-state.service';
import { 
  PatientStatusBadgeComponent, 
  TriageBadgeComponent, 
  VitalPillComponent, 
  AllergyTagComponent 
} from '../common/medical-badges.component';
import { ClinicalNote, Prescription, LabResult, VitalRecord } from '../../types';

@Component({
  selector: 'app-patient-detail-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PatientStatusBadgeComponent, 
    TriageBadgeComponent, 
    VitalPillComponent, 
    AllergyTagComponent
  ],
  template: `
    <div *ngIf="state.selectedPatient()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div class="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        <!-- Header Banner: Patient Demographic Bar -->
        <div class="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          
          <div class="flex items-start sm:items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-base font-mono flex-shrink-0">
              {{ getInitials(state.selectedPatient()!.fullName) }}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">
                  {{ state.selectedPatient()!.fullName }}
                </h2>
                <app-patient-status-badge [status]="state.selectedPatient()!.status"></app-patient-status-badge>
                <app-triage-badge [level]="state.selectedPatient()!.triageLevel"></app-triage-badge>
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>MRN: <strong class="text-slate-200">{{ state.selectedPatient()!.mrn }}</strong></span>
                <span>•</span>
                <span>{{ state.selectedPatient()!.age }} yrs (DOB: {{ state.selectedPatient()!.dob }})</span>
                <span>•</span>
                <span>Gender: {{ state.selectedPatient()!.gender }}</span>
                <span>•</span>
                <span>Blood: <strong class="text-rose-400">{{ state.selectedPatient()!.bloodType }}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 self-end md:self-auto">
            <div class="text-right hidden sm:block">
              <div class="text-[11px] text-slate-400">Assigned Ward Location</div>
              <div class="text-xs font-bold text-white font-mono">
                {{ state.selectedPatient()!.ward }} ({{ state.selectedPatient()!.bedNumber }})
              </div>
            </div>
            <button
              (click)="state.closePatientModal()"
              class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

        </div>

        <!-- Tab Bar -->
        <div class="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-semibold flex-shrink-0">
          <button
            (click)="activeTab = 'vitals'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap"
            [ngClass]="activeTab === 'vitals' ? 'border-sky-600 text-sky-700 font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'"
          >
            Telemetry & Vital Signs
          </button>
          <button
            (click)="activeTab = 'notes'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap"
            [ngClass]="activeTab === 'notes' ? 'border-sky-600 text-sky-700 font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'"
          >
            Clinical SOAP Notes ({{ state.selectedPatient()!.clinicalNotes.length }})
          </button>
          <button
            (click)="activeTab = 'medications'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap"
            [ngClass]="activeTab === 'medications' ? 'border-sky-600 text-sky-700 font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'"
          >
            E-Prescriptions ({{ state.selectedPatient()!.prescriptions.length }})
          </button>
          <button
            (click)="activeTab = 'labs'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap"
            [ngClass]="activeTab === 'labs' ? 'border-sky-600 text-sky-700 font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'"
          >
            Diagnostics & Labs ({{ state.selectedPatient()!.labResults.length }})
          </button>
          <button
            (click)="activeTab = 'admission'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap"
            [ngClass]="activeTab === 'admission' ? 'border-sky-600 text-sky-700 font-bold bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'"
          >
            Intake & Insurance
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          <!-- TAB 1: VITALS -->
          <div *ngIf="activeTab === 'vitals'" class="space-y-6">
            
            <!-- Latest Vitals Grid -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Live Continuous Telemetry Stream
                </h3>
                <span class="text-[11px] font-mono text-slate-500">
                  Last Recorded: {{ state.selectedPatient()!.latestVitals.timestamp }} by {{ state.selectedPatient()!.latestVitals.recordedBy }}
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <app-vital-pill
                  label="Blood Pressure"
                  [value]="state.selectedPatient()!.latestVitals.bloodPressure"
                  unit="mmHg"
                  icon="bp"
                ></app-vital-pill>

                <app-vital-pill
                  label="Heart Rate"
                  [value]="state.selectedPatient()!.latestVitals.heartRate"
                  unit="bpm"
                  icon="hr"
                  [isAlert]="state.selectedPatient()!.latestVitals.heartRate > 100 || state.selectedPatient()!.latestVitals.heartRate < 55"
                ></app-vital-pill>

                <app-vital-pill
                  label="SpO2 Saturation"
                  [value]="state.selectedPatient()!.latestVitals.oxygenSaturation"
                  unit="%"
                  icon="o2"
                  [isAlert]="state.selectedPatient()!.latestVitals.oxygenSaturation < 94"
                ></app-vital-pill>

                <app-vital-pill
                  label="Respiration"
                  [value]="state.selectedPatient()!.latestVitals.respiratoryRate"
                  unit="/min"
                  icon="resp"
                ></app-vital-pill>

                <app-vital-pill
                  label="Body Temp"
                  [value]="state.selectedPatient()!.latestVitals.temperature"
                  unit="°C"
                  icon="temp"
                  [isAlert]="state.selectedPatient()!.latestVitals.temperature > 38.0"
                ></app-vital-pill>

                <app-vital-pill
                  label="Pain Scale"
                  [value]="state.selectedPatient()!.latestVitals.painScore + '/10'"
                  unit="Numeric"
                  icon="pain"
                ></app-vital-pill>
              </div>
            </div>

            <!-- Vitals Recording Form -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 class="font-bold text-slate-900 text-xs">Record New Vital Signs</h4>
              <div class="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">BP (mmHg)</label>
                  <input [(ngModel)]="newBp" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">HR (bpm)</label>
                  <input type="number" [(ngModel)]="newHr" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">SpO2 (%)</label>
                  <input type="number" [(ngModel)]="newSpo2" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Resp Rate</label>
                  <input type="number" [(ngModel)]="newRr" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Temp (°C)</label>
                  <input type="number" step="0.1" [(ngModel)]="newTemp" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono" />
                </div>
                <div class="flex items-end">
                  <button
                    (click)="submitNewVitals()"
                    class="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg p-1.5 text-xs transition-colors cursor-pointer"
                  >
                    Save Vitals
                  </button>
                </div>
              </div>
            </div>

            <!-- Historical Log -->
            <div>
              <h4 class="font-bold text-slate-900 text-xs mb-2">Historical Vital Signs Log</h4>
              <div class="border border-slate-200 rounded-xl overflow-hidden">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                      <th class="p-2.5 pl-3">Timestamp</th>
                      <th class="p-2.5">BP</th>
                      <th class="p-2.5">Heart Rate</th>
                      <th class="p-2.5">SpO2</th>
                      <th class="p-2.5">Resp Rate</th>
                      <th class="p-2.5">Temp</th>
                      <th class="p-2.5">Nurse / Doctor</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-mono">
                    <tr *ngFor="let v of state.selectedPatient()!.vitalsHistory">
                      <td class="p-2.5 pl-3 text-slate-800">{{ v.timestamp }}</td>
                      <td class="p-2.5 font-bold">{{ v.bloodPressure }}</td>
                      <td class="p-2.5">{{ v.heartRate }} bpm</td>
                      <td class="p-2.5">{{ v.oxygenSaturation }}%</td>
                      <td class="p-2.5">{{ v.respiratoryRate }}/min</td>
                      <td class="p-2.5">{{ v.temperature }}°C</td>
                      <td class="p-2.5 font-sans text-slate-500">{{ v.recordedBy }}</td>
                    </tr>
                    <tr *ngIf="state.selectedPatient()!.vitalsHistory.length === 0">
                      <td colspan="7" class="p-4 text-center text-slate-400 font-sans">No previous vitals entries logged.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- TAB 2: SOAP NOTES -->
          <div *ngIf="activeTab === 'notes'" class="space-y-6">
            
            <!-- Add SOAP Note -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 class="font-bold text-slate-900 text-xs">Add Clinical Physician Progress Note (SOAP)</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Subjective (Symptom updates)</label>
                  <textarea [(ngModel)]="noteSubjective" placeholder="Patient reports..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs h-16"></textarea>
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Objective (Findings & exams)</label>
                  <textarea [(ngModel)]="noteObjective" placeholder="Physical examination..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs h-16"></textarea>
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Assessment (Clinical impression)</label>
                  <textarea [(ngModel)]="noteAssessment" placeholder="Assessment..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs h-16"></textarea>
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Plan (Orders, meds, procedures)</label>
                  <textarea [(ngModel)]="notePlan" placeholder="Continue IV fluids..." class="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs h-16"></textarea>
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  (click)="submitSoapNote()"
                  class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Sign & Append SOAP Note
                </button>
              </div>
            </div>

            <!-- Notes List -->
            <div class="space-y-3">
              <div
                *ngFor="let note of state.selectedPatient()!.clinicalNotes"
                class="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-2xs"
              >
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900">{{ note.authorName }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{{ note.authorRole }}</span>
                  </div>
                  <span class="font-mono text-slate-400 text-[11px]">{{ note.timestamp }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div *ngIf="note.content.subjective" class="p-2.5 rounded-lg bg-slate-50">
                    <strong class="text-slate-900 block text-[11px]">Subjective:</strong>
                    <p class="text-slate-600 mt-0.5">{{ note.content.subjective }}</p>
                  </div>
                  <div *ngIf="note.content.objective" class="p-2.5 rounded-lg bg-slate-50">
                    <strong class="text-slate-900 block text-[11px]">Objective:</strong>
                    <p class="text-slate-600 mt-0.5">{{ note.content.objective }}</p>
                  </div>
                  <div *ngIf="note.content.assessment" class="p-2.5 rounded-lg bg-slate-50">
                    <strong class="text-slate-900 block text-[11px]">Assessment:</strong>
                    <p class="text-slate-600 mt-0.5">{{ note.content.assessment }}</p>
                  </div>
                  <div *ngIf="note.content.plan" class="p-2.5 rounded-lg bg-slate-50">
                    <strong class="text-slate-900 block text-[11px]">Plan:</strong>
                    <p class="text-slate-600 mt-0.5">{{ note.content.plan }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 3: MEDICATIONS -->
          <div *ngIf="activeTab === 'medications'" class="space-y-6">
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 class="font-bold text-slate-900 text-xs">Order New Inpatient Medication</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Medication Name</label>
                  <input [(ngModel)]="newMedName" placeholder="e.g. Ceftriaxone" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Dosage</label>
                  <input [(ngModel)]="newMedDosage" placeholder="e.g. 1g IV" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs" />
                </div>
                <div>
                  <label class="text-[10px] text-slate-500 block mb-1">Frequency</label>
                  <input [(ngModel)]="newMedFreq" placeholder="e.g. Q12H" class="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs" />
                </div>
                <div class="flex items-end">
                  <button
                    (click)="submitPrescription()"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-1.5 text-xs transition-colors cursor-pointer"
                  >
                    E-Prescribe to Pharmacy
                  </button>
                </div>
              </div>
            </div>

            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th class="p-2.5 pl-3">Medication Name</th>
                    <th class="p-2.5">Dosage / Route</th>
                    <th class="p-2.5">Frequency</th>
                    <th class="p-2.5">Prescribed By</th>
                    <th class="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let rx of state.selectedPatient()!.prescriptions">
                    <td class="p-2.5 pl-3 font-bold text-slate-900">{{ rx.name }}</td>
                    <td class="p-2.5 font-mono">{{ rx.dosage }} • {{ rx.route }}</td>
                    <td class="p-2.5 font-mono">{{ rx.frequency }}</td>
                    <td class="p-2.5 text-slate-600">{{ rx.prescribedBy }}</td>
                    <td class="p-2.5">
                      <span class="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono"
                        [ngClass]="rx.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                      >
                        {{ rx.status }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="state.selectedPatient()!.prescriptions.length === 0">
                    <td colspan="5" class="p-4 text-center text-slate-400">No active medication orders.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 4: LABS -->
          <div *ngIf="activeTab === 'labs'" class="space-y-4">
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th class="p-2.5 pl-3">Test Name & Category</th>
                    <th class="p-2.5">Result</th>
                    <th class="p-2.5">Normal Range</th>
                    <th class="p-2.5">Flag</th>
                    <th class="p-2.5">Timestamp</th>
                    <th class="p-2.5">Ordered By</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let lab of state.selectedPatient()!.labResults">
                    <td class="p-2.5 pl-3">
                      <div class="font-bold text-slate-900">{{ lab.testName }}</div>
                      <div class="text-[10px] text-slate-400">{{ lab.category }}</div>
                    </td>
                    <td class="p-2.5 font-mono font-bold">{{ lab.value }} {{ lab.unit }}</td>
                    <td class="p-2.5 font-mono text-slate-500">{{ lab.normalRange }}</td>
                    <td class="p-2.5 font-mono">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                        [ngClass]="{
                          'bg-rose-100 text-rose-800': lab.flag === 'HIGH' || lab.flag === 'CRITICAL_HIGH',
                          'bg-emerald-100 text-emerald-800': lab.flag === 'NORMAL',
                          'bg-amber-100 text-amber-800': lab.flag === 'LOW'
                        }"
                      >
                        {{ lab.flag }}
                      </span>
                    </td>
                    <td class="p-2.5 font-mono text-slate-500">{{ lab.timestamp }}</td>
                    <td class="p-2.5 text-slate-600">{{ lab.orderedBy }}</td>
                  </tr>
                  <tr *ngIf="state.selectedPatient()!.labResults.length === 0">
                    <td colspan="6" class="p-4 text-center text-slate-400">No laboratory results returned yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 5: INTAKE & DISCHARGE -->
          <div *ngIf="activeTab === 'admission'" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 class="font-bold text-slate-900 text-xs">Insurance & Financial Authorization</h4>
                <div class="text-xs space-y-1">
                  <div><strong>Provider:</strong> {{ state.selectedPatient()!.insurance.provider }}</div>
                  <div><strong>Policy #:</strong> {{ state.selectedPatient()!.insurance.policyNumber }}</div>
                  <div><strong>Verification Status:</strong> <span class="text-emerald-700 font-bold">{{ state.selectedPatient()!.insurance.coverageStatus }}</span></div>
                </div>
              </div>

              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 class="font-bold text-slate-900 text-xs">Emergency Contact Details</h4>
                <div class="text-xs space-y-1">
                  <div><strong>Name:</strong> {{ state.selectedPatient()!.emergencyContact.name }}</div>
                  <div><strong>Relationship:</strong> {{ state.selectedPatient()!.emergencyContact.relationship }}</div>
                  <div><strong>Phone:</strong> {{ state.selectedPatient()!.emergencyContact.phone }}</div>
                </div>
              </div>
            </div>

            <!-- Discharge Action -->
            <div class="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-rose-950 text-xs">Patient Discharge Protocol</h4>
                <p class="text-[11px] text-rose-700">Discharge patient, release bed to sanitation, and close inpatient encounter.</p>
              </div>
              <button
                (click)="dischargePatient()"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Discharge Patient & Release Bed
              </button>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-medium">Allergies:</span>
            <app-allergy-tag *ngFor="let a of state.selectedPatient()!.allergies" [allergy]="a"></app-allergy-tag>
          </div>
          <button
            (click)="state.closePatientModal()"
            class="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close Chart
          </button>
        </div>

      </div>
    </div>
  `
})
export class PatientDetailModalComponent {
  readonly state = inject(MedicalStateService);
  activeTab: 'vitals' | 'notes' | 'medications' | 'labs' | 'admission' = 'vitals';

  // New Vitals Form
  newBp = '122/80';
  newHr = 76;
  newSpo2 = 98;
  newRr = 16;
  newTemp = 36.9;

  // New SOAP Note Form
  noteSubjective = '';
  noteObjective = '';
  noteAssessment = '';
  notePlan = '';

  // New Medication Form
  newMedName = '';
  newMedDosage = '';
  newMedFreq = 'Daily';

  getInitials(name: string): string {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  }

  submitNewVitals() {
    const patient = this.state.selectedPatient();
    if (!patient) return;

    const newRecord: VitalRecord = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bloodPressure: this.newBp,
      heartRate: Number(this.newHr),
      oxygenSaturation: Number(this.newSpo2),
      respiratoryRate: Number(this.newRr),
      temperature: Number(this.newTemp),
      painScore: patient.latestVitals.painScore,
      recordedBy: this.state.currentUser().name,
    };

    const updated = {
      ...patient,
      latestVitals: newRecord,
      vitalsHistory: [newRecord, ...patient.vitalsHistory],
    };

    this.state.updatePatient(updated);
    this.state.showToast(`Updated vitals for ${patient.fullName}`, 'success');
  }

  submitSoapNote() {
    const patient = this.state.selectedPatient();
    if (!patient) return;

    const newNote: ClinicalNote = {
      id: `NOTE-${Date.now()}`,
      authorName: this.state.currentUser().name,
      authorRole: this.state.currentUser().roleTitle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      noteType: 'SOAP Note',
      content: {
        subjective: this.noteSubjective,
        objective: this.noteObjective,
        assessment: this.noteAssessment,
        plan: this.notePlan,
      },
    };

    const updated = {
      ...patient,
      clinicalNotes: [newNote, ...patient.clinicalNotes],
    };

    this.state.updatePatient(updated);
    this.state.showToast('SOAP progress note signed & appended', 'success');
    this.noteSubjective = '';
    this.noteObjective = '';
    this.noteAssessment = '';
    this.notePlan = '';
  }

  submitPrescription() {
    const patient = this.state.selectedPatient();
    if (!patient || !this.newMedName) return;

    const newRx: Prescription = {
      id: `RX-${Date.now()}`,
      name: this.newMedName,
      dosage: this.newMedDosage || 'Standard Dose',
      route: 'Oral',
      frequency: this.newMedFreq,
      startDate: new Date().toISOString().split('T')[0],
      prescribedBy: this.state.currentUser().name,
      status: 'active',
    };

    const updated = {
      ...patient,
      prescriptions: [newRx, ...patient.prescriptions],
    };

    this.state.updatePatient(updated);
    this.state.showToast(`Prescription for ${this.newMedName} routed to Pharmacy queue`, 'success');
    this.newMedName = '';
    this.newMedDosage = '';
  }

  dischargePatient() {
    const patient = this.state.selectedPatient();
    if (!patient) return;

    const updated = {
      ...patient,
      status: 'discharged' as const,
    };

    this.state.updatePatient(updated);
    this.state.closePatientModal();
    this.state.showToast(`Patient ${patient.fullName} successfully discharged. Bed ${patient.bedNumber} released for sanitation.`, 'success');
  }
}
