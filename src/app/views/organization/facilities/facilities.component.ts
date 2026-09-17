import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
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
import { FacilityService } from '../../../core/services/facility.service';
import {
  Facility,
  FacilityType,
  FacilityClassification,
  FacilityStatus,
  CreateFacilityRequest,
  UpdateFacilityRequest
} from '../../../core/models/facility.models';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
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
export class FacilitiesComponent implements OnInit {
  private facilityService = inject(FacilityService);

  facilities = signal<Facility[]>([]);
  isLoading = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Filters
  filterType = signal<FacilityType | ''>('');
  filterStatus = signal<FacilityStatus | ''>('');

  // Create Modal State
  createModalVisible = signal(false);
  isSubmitting = signal(false);
  newFacility: CreateFacilityRequest = {
    code: '',
    name: '',
    type: 'HOSPITAL',
    classification: 'CLASS_B',
    nationalRegistryCode: '',
    address: '',
    phone: ''
  };

  // Edit Modal State
  editModalVisible = signal(false);
  editingFacilityId: string | null = null;
  editPayload: UpdateFacilityRequest = {
    name: '',
    classification: 'CLASS_B',
    nationalRegistryCode: '',
    address: '',
    phone: ''
  };

  // Status Change Modal State
  statusModalVisible = signal(false);
  statusTargetFacility: Facility | null = null;
  selectedNewStatus: FacilityStatus = 'ACTIVE';

  readonly facilityTypes: FacilityType[] = ['HOSPITAL', 'CLINIC', 'LABORATORY', 'PHARMACY'];
  readonly classifications: FacilityClassification[] = [
    'CLASS_A',
    'CLASS_B',
    'CLASS_C',
    'CLASS_D',
    'PRATAMA',
    'UTAMA',
    'NONE'
  ];
  readonly facilityStatuses: FacilityStatus[] = [
    'ACTIVE',
    'INACTIVE',
    'UNDER_MAINTENANCE',
    'DECOMMISSIONED'
  ];

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.isLoading.set(true);
    const type = this.filterType() ? (this.filterType() as FacilityType) : undefined;
    const status = this.filterStatus() ? (this.filterStatus() as FacilityStatus) : undefined;

    this.facilityService.listFacilities(type, status).subscribe({
      next: (list) => {
        this.facilities.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load healthcare facilities.');
      }
    });
  }

  openCreateModal(): void {
    this.newFacility = {
      code: '',
      name: '',
      type: 'HOSPITAL',
      classification: 'CLASS_B',
      nationalRegistryCode: '',
      address: '',
      phone: ''
    };
    this.createModalVisible.set(true);
  }

  submitCreate(): void {
    if (!this.newFacility.code || !this.newFacility.name) {
      this.showAlert('warning', 'Code and Name are required fields.');
      return;
    }
    this.isSubmitting.set(true);
    this.facilityService.createFacility(this.newFacility).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `Facility '${created.name}' created successfully.`);
        this.loadFacilities();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Error creating facility.');
      }
    });
  }

  openEditModal(f: Facility): void {
    this.editingFacilityId = f.id;
    this.editPayload = {
      name: f.name,
      classification: f.classification,
      nationalRegistryCode: f.nationalRegistryCode || '',
      address: f.address || '',
      phone: f.phone || ''
    };
    this.editModalVisible.set(true);
  }

  submitEdit(): void {
    if (!this.editingFacilityId || !this.editPayload.name) return;
    this.isSubmitting.set(true);
    this.facilityService.updateFacility(this.editingFacilityId, this.editPayload).subscribe({
      next: (updated) => {
        this.isSubmitting.set(false);
        this.editModalVisible.set(false);
        this.showAlert('success', `Facility '${updated.name}' updated successfully.`);
        this.loadFacilities();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Error updating facility.');
      }
    });
  }

  openStatusModal(f: Facility): void {
    this.statusTargetFacility = f;
    this.selectedNewStatus = f.status;
    this.statusModalVisible.set(true);
  }

  submitStatusChange(): void {
    if (!this.statusTargetFacility) return;
    this.isSubmitting.set(true);
    this.facilityService
      .changeStatus(this.statusTargetFacility.id, { status: this.selectedNewStatus })
      .subscribe({
        next: (updated) => {
          this.isSubmitting.set(false);
          this.statusModalVisible.set(false);
          this.showAlert('success', `Status changed to ${updated.status}.`);
          this.loadFacilities();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.showAlert('danger', err?.error?.message || 'Error changing facility status.');
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
