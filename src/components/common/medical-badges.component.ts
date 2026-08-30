import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriageLevel, PatientStatus, BedStatus } from '../../types';

@Component({
  selector: 'app-triage-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1 font-bold font-mono tracking-tight rounded-md border uppercase"
      [ngClass]="[getSizeClass(), getColorClass()]"
    >
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getDotColorClass()"></span>
      <span>ESI-{{ level }}: {{ getLevelLabel() }}</span>
    </span>
  `
})
export class TriageBadgeComponent {
  @Input() level: TriageLevel = 3;
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';

  getSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'text-[10px] px-2 py-0.5';
      case 'md': return 'text-xs px-2.5 py-1';
      case 'lg': return 'text-sm px-3 py-1.5 font-bold';
    }
  }

  getColorClass(): string {
    switch (this.level) {
      case 1: return 'bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-200';
      case 2: return 'bg-amber-50 text-amber-950 border-amber-300 ring-1 ring-amber-200';
      case 3: return 'bg-yellow-50 text-yellow-950 border-yellow-300';
      case 4: return 'bg-emerald-50 text-emerald-950 border-emerald-300';
      case 5: return 'bg-blue-50 text-blue-950 border-blue-300';
      default: return 'bg-slate-50 text-slate-900 border-slate-300';
    }
  }

  getDotColorClass(): string {
    switch (this.level) {
      case 1: return 'bg-rose-600 animate-ping';
      case 2: return 'bg-amber-600';
      case 3: return 'bg-yellow-600';
      case 4: return 'bg-emerald-600';
      case 5: return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  }

  getLevelLabel(): string {
    switch (this.level) {
      case 1: return 'Resuscitation';
      case 2: return 'Emergent';
      case 3: return 'Urgent';
      case 4: return 'Less Urgent';
      case 5: return 'Non-Urgent';
    }
  }
}

@Component({
  selector: 'app-patient-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono border"
      [ngClass]="getStatusClass()"
    >
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getDotClass()"></span>
      <span>{{ getFormattedStatus() }}</span>
    </span>
  `
})
export class PatientStatusBadgeComponent {
  @Input() status: PatientStatus = 'admitted';

  getStatusClass(): string {
    switch (this.status) {
      case 'critical': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'admitted': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'observation': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'er_triage': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'discharged': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  getDotClass(): string {
    switch (this.status) {
      case 'critical': return 'bg-rose-600 animate-pulse';
      case 'admitted': return 'bg-sky-600';
      case 'observation': return 'bg-amber-600';
      case 'er_triage': return 'bg-purple-600';
      case 'discharged': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  }

  getFormattedStatus(): string {
    return this.status.replace('_', ' ');
  }
}

@Component({
  selector: 'app-bed-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider font-mono border"
      [ngClass]="getBedClass()"
    >
      <span>{{ status }}</span>
    </span>
  `
})
export class BedStatusBadgeComponent {
  @Input() status: BedStatus = 'available';

  getBedClass(): string {
    switch (this.status) {
      case 'available': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'occupied': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'cleaning': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'maintenance': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'reserved': return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
}

@Component({
  selector: 'app-vital-pill',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="p-2.5 rounded-xl border flex flex-col justify-between transition-colors"
      [ngClass]="isAlert ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200' : 'bg-slate-50 border-slate-200'"
    >
      <div class="flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>{{ label }}</span>
        <span *ngIf="isAlert" class="text-rose-600 font-bold text-[10px] tracking-tight animate-pulse">ALERT</span>
      </div>
      <div class="flex items-baseline gap-1 mt-1 font-mono">
        <span class="text-base font-bold tracking-tight" [ngClass]="isAlert ? 'text-rose-700' : 'text-slate-900'">
          {{ value }}
        </span>
        <span class="text-[10px] text-slate-400">{{ unit }}</span>
      </div>
    </div>
  `
})
export class VitalPillComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() unit = '';
  @Input() isAlert = false;
  @Input() icon?: 'bp' | 'hr' | 'o2' | 'temp' | 'resp' | 'pain';
}

@Component({
  selector: 'app-allergy-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
      <svg class="w-3 h-3 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ allergy }}</span>
    </span>
  `
})
export class AllergyTagComponent {
  @Input() allergy = '';
}
