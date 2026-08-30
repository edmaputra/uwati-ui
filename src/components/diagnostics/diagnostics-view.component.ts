import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diagnostics-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 pb-12">
      
      <!-- Top Banner -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Hospital Diagnostics, Pathology & PACS Radiology</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            DICOM Imaging studies, Automated Hematology & Biochemistry interface, and STAT Lab alerts
          </p>
        </div>
      </div>

      <!-- PACS & Lab Worklist -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Left: Radiology PACS Studies -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm">Radiology & PACS Imaging Queue</h3>
            <span class="text-xs font-mono text-slate-400">DICOM 3.0 Live</span>
          </div>

          <div class="space-y-3">
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">High-Resolution CT Pulmonary Angiogram</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">COMPLETED</span>
              </div>
              <div class="text-xs text-slate-600">Patient: Arthur Pendelton (MRN: 849201)</div>
              <p class="text-[11px] text-slate-500 font-mono">Finding: Bilateral lower lobe patchy consolidation; no central PE.</p>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">Brain MRI with Contrast (1.5T)</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">IN PROGRESS</span>
              </div>
              <div class="text-xs text-slate-600">Patient: Marcus Sterling (MRN: 492015)</div>
              <p class="text-[11px] text-slate-500 font-mono">Indication: Intracranial aneurysm evaluation & post-clip surveillance.</p>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">Transthoracic Echocardiogram (TTE)</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">COMPLETED</span>
              </div>
              <div class="text-xs text-slate-600">Patient: Eleanor Vance (MRN: 730194)</div>
              <p class="text-[11px] text-slate-500 font-mono">Finding: LVEF 40%, moderate aortic valve stenosis with calcification.</p>
            </div>
          </div>
        </div>

        <!-- Right: Automated Pathology & Critical Labs -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm">Pathology & Biochemistry Workstation</h3>
            <span class="text-xs font-mono text-slate-400">HL7 LIS Gateway</span>
          </div>

          <div class="space-y-3">
            <div class="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">High-Sensitivity Troponin I</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-600 text-white">CRITICAL HIGH</span>
              </div>
              <div class="text-xs text-slate-700">Patient: Arthur Pendelton • Value: <strong class="text-rose-700">1.45 ng/mL</strong> (Ref: &lt;0.04)</div>
              <p class="text-[11px] text-slate-500 font-mono">Flagged to Cardiology on-call at 06:15 AM</p>
            </div>

            <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">Serum Potassium (K+)</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-600 text-white">LOW (3.1 mEq/L)</span>
              </div>
              <div class="text-xs text-slate-700">Patient: Sophia Chen • Value: <strong class="text-amber-700">3.1 mEq/L</strong> (Ref: 3.5 - 5.0)</div>
              <p class="text-[11px] text-slate-500 font-mono">Oral KCl replenishment protocol initiated</p>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900">Complete Blood Count (CBC) w/ Diff</span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">NORMAL</span>
              </div>
              <div class="text-xs text-slate-700">Patient: David Rodriguez • WBC: 8.4 K/uL, Hgb: 14.2 g/dL</div>
              <p class="text-[11px] text-slate-500 font-mono">Verified by Automated Flow Cytometry</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class DiagnosticsViewComponent {}
