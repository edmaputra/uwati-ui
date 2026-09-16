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
import { ServiceUnitService } from '../../../core/services/service-unit.service';
import { Facility } from '../../../core/models/facility.models';
import {
  ServiceUnit,
  ServiceUnitType,
  ServiceUnitStatus,
  CreateServiceUnitRequest,
  UpdateServiceUnitRequest
} from '../../../core/models/service-unit.models';

@Component({
  selector: 'app-service-units',
  templateUrl: './service-units.component.html',
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
export class ServiceUnitsComponent implements OnInit {
  private facilityService = inject(FacilityService);
  private serviceUnitService = inject(ServiceUnitService);

  facilities = signal<Facility[]>([]);
  selectedFacilityId = signal<string>('');
  serviceUnits = signal<ServiceUnit[]>([]);

  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Filters
  filterType = signal<ServiceUnitType | ''>('');
  filterStatus = signal<ServiceUnitStatus | ''>('');

  // Create Modal
  createModalVisible = signal(false);
  newUnit: CreateServiceUnitRequest = {
    facilityId: '',
    code: '',
    name: '',
    type: 'OUTPATIENT_CLINIC'
  };

  // Edit Modal
  editModalVisible = signal(false);
  editingUnitId: string | null = null;
  editPayload: UpdateServiceUnitRequest = {
    name: ''
  };

  // Status Change Modal
  statusModalVisible = signal(false);
  targetUnit: ServiceUnit | null = null;
  selectedStatus: ServiceUnitStatus = 'ACTIVE';

  readonly unitTypes: ServiceUnitType[] = [
    'OUTPATIENT_CLINIC',
    'INPATIENT_WARD',
    'EMERGENCY',
    'INTENSIVE_CARE',
    'PHARMACY',
    'LABORATORY',
    'RADIOLOGY',
    'SURGERY_THEATER',
    'CASHIER',
    'ADMINISTRATIVE'
  ];

  readonly unitStatuses: ServiceUnitStatus[] = ['ACTIVE', 'INACTIVE'];

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.facilityService.listFacilities().subscribe({
      next: (list) => {
        this.facilities.set(list);
        if (list.length > 0 && !this.selectedFacilityId()) {
          this.selectedFacilityId.set(list[0].id);
          this.loadServiceUnits();
        }
      },
      error: (err) => {
        this.showAlert('danger', err?.error?.message || 'Failed to load facilities.');
      }
    });
  }

  loadServiceUnits(): void {
    const facilityId = this.selectedFacilityId();
    if (!facilityId) {
      this.serviceUnits.set([]);
      return;
    }

    this.isLoading.set(true);
    const type = this.filterType() ? (this.filterType() as ServiceUnitType) : undefined;
    const status = this.filterStatus() ? (this.filterStatus() as ServiceUnitStatus) : undefined;

    this.serviceUnitService.listServiceUnits(facilityId, type, status).subscribe({
      next: (units) => {
        this.serviceUnits.set(units);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load service units.');
      }
    });
  }

  onFacilityChange(facilityId: string): void {
    this.selectedFacilityId.set(facilityId);
    this.loadServiceUnits();
  }

  openCreateModal(): void {
    if (!this.selectedFacilityId()) {
      this.showAlert('warning', 'Please select a facility first.');
      return;
    }
    this.newUnit = {
      facilityId: this.selectedFacilityId(),
      code: '',
      name: '',
      type: 'OUTPATIENT_CLINIC'
    };
    this.createModalVisible.set(true);
  }

  submitCreate(): void {
    if (!this.newUnit.code || !this.newUnit.name) {
      this.showAlert('warning', 'Code and Name are required fields.');
      return;
    }
    this.isSubmitting.set(true);
    this.newUnit.facilityId = this.selectedFacilityId();

    this.serviceUnitService.createServiceUnit(this.newUnit).subscribe({
      next: (unit) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `Service unit '${unit.name}' created successfully.`);
        this.loadServiceUnits();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to create service unit.');
      }
    });
  }

  openEditModal(unit: ServiceUnit): void {
    this.editingUnitId = unit.id;
    this.editPayload = { name: unit.name };
    this.editModalVisible.set(true);
  }

  submitEdit(): void {
    if (!this.editingUnitId || !this.editPayload.name) return;
    this.isSubmitting.set(true);

    this.serviceUnitService.updateServiceUnit(this.editingUnitId, this.editPayload).subscribe({
      next: (unit) => {
        this.isSubmitting.set(false);
        this.editModalVisible.set(false);
        this.showAlert('success', `Service unit '${unit.name}' updated.`);
        this.loadServiceUnits();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to update service unit.');
      }
    });
  }

  openStatusModal(unit: ServiceUnit): void {
    this.targetUnit = unit;
    this.selectedStatus = unit.status;
    this.statusModalVisible.set(true);
  }

  submitStatusChange(): void {
    if (!this.targetUnit) return;
    this.isSubmitting.set(true);

    this.serviceUnitService
      .changeStatus(this.targetUnit.id, { status: this.selectedStatus })
      .subscribe({
        next: (unit) => {
          this.isSubmitting.set(false);
          this.statusModalVisible.set(false);
          this.showAlert('success', `Status updated to ${unit.status}.`);
          this.loadServiceUnits();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.showAlert('danger', err?.error?.message || 'Failed to update unit status.');
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
