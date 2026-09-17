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
import { IamGroup, CreateGroupRequest, IamUser } from '../../../core/models/iam.models';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
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
export class GroupsComponent implements OnInit {
  private iamService = inject(IamService);

  groups = signal<IamGroup[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Create Modal
  createModalVisible = signal(false);
  newGroup: CreateGroupRequest = {
    name: '',
    description: '',
    externalIdpGroupName: ''
  };

  // Members Modal
  membersModalVisible = signal(false);
  selectedGroup: IamGroup | null = null;
  groupMembers = signal<IamUser[]>([]);
  isLoadingMembers = signal(false);

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading.set(true);
    this.iamService.listGroups().subscribe({
      next: (list) => {
        this.groups.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load user groups.');
      }
    });
  }

  openCreateModal(): void {
    this.newGroup = { name: '', description: '', externalIdpGroupName: '' };
    this.createModalVisible.set(true);
  }

  submitCreate(): void {
    if (!this.newGroup.name) {
      this.showAlert('warning', 'Group name is required.');
      return;
    }
    this.isSubmitting.set(true);
    this.iamService.createGroup(this.newGroup).subscribe({
      next: (g) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `Group '${g.name}' created successfully.`);
        this.loadGroups();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to create group.');
      }
    });
  }

  viewMembers(group: IamGroup): void {
    this.selectedGroup = group;
    this.membersModalVisible.set(true);
    this.isLoadingMembers.set(true);

    this.iamService.getGroupMembers(group.id).subscribe({
      next: (members) => {
        this.groupMembers.set(members);
        this.isLoadingMembers.set(false);
      },
      error: () => {
        this.groupMembers.set([]);
        this.isLoadingMembers.set(false);
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
