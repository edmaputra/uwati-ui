import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  SpinnerComponent,
  TableDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { TenantService } from '../../core/services/tenant.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Tenant,
  CreateTenantRequest,
  TenantSettingResponse,
  TenantSettingItem
} from '../../core/models/tenancy.models';

@Component({
  selector: 'app-tenancy',
  templateUrl: './tenancy.component.html',
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    IconDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RowComponent,
    SpinnerComponent,
    TableDirective
  ]
})
export class TenancyComponent implements OnInit {
  private tenantService = inject(TenantService);
  readonly authService = inject(AuthService);

  targetTenantId = signal<string>(this.authService.getTenantId() ?? '');
  settings = signal<TenantSettingItem[]>([]);
  rawSettingsResponse = signal<TenantSettingResponse[]>([]);

  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Create Tenant Modal
  createModalVisible = signal(false);
  newTenant: CreateTenantRequest = {
    legalName: '',
    displayName: ''
  };
  createdTenant = signal<Tenant | null>(null);

  // New Setting Entry
  newKey = '';
  newValue = '';

  ngOnInit(): void {
    if (this.targetTenantId()) {
      this.loadSettings();
    }
  }

  loadSettings(): void {
    const tid = this.targetTenantId().trim();
    if (!tid) {
      this.showAlert('warning', 'Please enter a Tenant ID to load settings.');
      return;
    }

    this.isLoading.set(true);
    this.tenantService.getTenantSettings(tid).subscribe({
      next: (list) => {
        this.rawSettingsResponse.set(list);
        this.settings.set(list.map((s) => ({ key: s.key, value: s.value })));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load tenant settings.');
      }
    });
  }

  openCreateModal(): void {
    this.newTenant = { legalName: '', displayName: '' };
    this.createdTenant.set(null);
    this.createModalVisible.set(true);
  }

  submitCreateTenant(): void {
    if (!this.newTenant.legalName || !this.newTenant.displayName) {
      this.showAlert('warning', 'Legal name and display name are required.');
      return;
    }
    this.isSubmitting.set(true);
    this.tenantService.createTenant(this.newTenant).subscribe({
      next: (t) => {
        this.isSubmitting.set(false);
        this.createdTenant.set(t);
        this.targetTenantId.set(t.id);
        this.authService.setTenantId(t.id);
        this.showAlert('success', `Tenant '${t.displayName}' provisioned successfully!`);
        this.loadSettings();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to provision tenant.');
      }
    });
  }

  addSetting(): void {
    const k = this.newKey.trim();
    const v = this.newValue.trim();
    if (!k || !v) {
      this.showAlert('warning', 'Both Key and Value are required to add a setting.');
      return;
    }
    const current = [...this.settings()];
    const existingIndex = current.findIndex((s) => s.key === k);
    if (existingIndex >= 0) {
      current[existingIndex].value = v;
    } else {
      current.push({ key: k, value: v });
    }
    this.settings.set(current);
    this.newKey = '';
    this.newValue = '';
  }

  removeSetting(index: number): void {
    const current = [...this.settings()];
    current.splice(index, 1);
    this.settings.set(current);
  }

  saveAllSettings(): void {
    const tid = this.targetTenantId().trim();
    if (!tid) return;

    this.isSubmitting.set(true);
    this.tenantService
      .configureTenantSettings(tid, { settings: this.settings() })
      .subscribe({
        next: (updated) => {
          this.isSubmitting.set(false);
          this.rawSettingsResponse.set(updated);
          this.settings.set(updated.map((s) => ({ key: s.key, value: s.value })));
          this.showAlert('success', 'Tenant settings successfully updated.');
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.showAlert('danger', err?.error?.message || 'Failed to update tenant settings.');
        }
      });
  }

  showAlert(type: string, text: string): void {
    this.alertMessage.set({ type, text });
    setTimeout(() => {
      this.alertMessage.set(null);
    }, 5000);
  }
}
