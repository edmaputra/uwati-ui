import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MedicalStateService } from './services/medical-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  template: `
    <!-- Core Application Routing Stage -->
    <router-outlet></router-outlet>

    <!-- Global Clinical Toast Notification -->
    @if (state.toast()) {
      <div
        class="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200"
      >
        <div
          class="px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md"
          [ngClass]="{
            'bg-slate-900/95 text-white border-slate-700': state.toast()?.type === 'info',
            'bg-emerald-950/95 text-emerald-200 border-emerald-700': state.toast()?.type === 'success',
            'bg-rose-950/95 text-rose-200 border-rose-700': state.toast()?.type === 'alert'
          }"
        >
          <span class="w-2 h-2 rounded-full bg-current animate-ping"></span>
          <span>{{ state.toast()?.message }}</span>
          <button (click)="state.clearToast()" class="ml-2 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      </div>
    }
  `
})
export class AppComponent {
  readonly state = inject(MedicalStateService);
}
