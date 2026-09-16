import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
  BadgeComponent,
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
import { IamService } from '../../../core/services/iam.service';
import { IamRole, CreateRoleRequest } from '../../../core/models/iam.models';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    BadgeComponent,
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
export class RolesComponent implements OnInit {
  private iamService = inject(IamService);

  roles = signal<IamRole[]>([]);
  permissions = signal<string[]>([]);

  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Create Modal
  createModalVisible = signal(false);
  newRole: CreateRoleRequest = {
    name: '',
    description: '',
    permissions: []
  };

  selectedPermissionsMap = new Map<string, boolean>();

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.iamService.listRoles().subscribe({
      next: (list) => {
        this.roles.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load roles.');
      }
    });
  }

  loadPermissions(): void {
    this.iamService.listPermissions().subscribe({
      next: (perms) => {
        this.permissions.set(perms);
      },
      error: () => {
        this.permissions.set([]);
      }
    });
  }

  openCreateModal(): void {
    this.newRole = { name: '', description: '', permissions: [] };
    this.selectedPermissionsMap.clear();
    this.createModalVisible.set(true);
  }

  togglePermission(perm: string): void {
    const isChecked = !!this.selectedPermissionsMap.get(perm);
    this.selectedPermissionsMap.set(perm, !isChecked);
  }

  isPermissionSelected(perm: string): boolean {
    return !!this.selectedPermissionsMap.get(perm);
  }

  submitCreate(): void {
    if (!this.newRole.name) {
      this.showAlert('warning', 'Role name is required.');
      return;
    }

    const perms: string[] = [];
    this.selectedPermissionsMap.forEach((selected, perm) => {
      if (selected) perms.push(perm);
    });
    this.newRole.permissions = perms;

    this.isSubmitting.set(true);
    this.iamService.createRole(this.newRole).subscribe({
      next: (role) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `Role '${role.name}' created successfully.`);
        this.loadRoles();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to create role.');
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
