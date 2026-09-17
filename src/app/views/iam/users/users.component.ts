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
import { IamService } from '../../../core/services/iam.service';
import {
  IamUser,
  CreateUserRequest,
  UserStatus
} from '../../../core/models/iam.models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
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
export class UsersComponent implements OnInit {
  private iamService = inject(IamService);

  users = signal<IamUser[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Search filter
  searchQuery = signal('');
  statusFilter = signal<UserStatus | ''>('');

  // Create Modal
  createModalVisible = signal(false);
  newUser: CreateUserRequest = {
    email: '',
    fullName: '',
    password: '',
    status: 'ACTIVE'
  };

  // Status Change Modal
  statusModalVisible = signal(false);
  targetUser: IamUser | null = null;
  selectedStatus: UserStatus = 'ACTIVE';

  readonly userStatuses: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    const search = this.searchQuery().trim() || undefined;
    const status = this.statusFilter() || undefined;

    this.iamService.listUsers(search, status).subscribe({
      next: (list) => {
        this.users.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load users.');
      }
    });
  }

  openCreateModal(): void {
    this.newUser = { email: '', fullName: '', password: '', status: 'ACTIVE' };
    this.createModalVisible.set(true);
  }

  submitCreate(): void {
    if (!this.newUser.email || !this.newUser.fullName) {
      this.showAlert('warning', 'Email and Full Name are required.');
      return;
    }
    this.isSubmitting.set(true);
    this.iamService.createUser(this.newUser).subscribe({
      next: (u) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `User '${u.fullName}' provisioned successfully.`);
        this.loadUsers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to create user.');
      }
    });
  }

  openStatusModal(u: IamUser): void {
    this.targetUser = u;
    this.selectedStatus = u.status;
    this.statusModalVisible.set(true);
  }

  submitStatusChange(): void {
    if (!this.targetUser) return;
    this.isSubmitting.set(true);
    this.iamService
      .changeUserStatus(this.targetUser.id, { status: this.selectedStatus })
      .subscribe({
        next: (u) => {
          this.isSubmitting.set(false);
          this.statusModalVisible.set(false);
          this.showAlert('success', `User status updated to ${u.status}.`);
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.showAlert('danger', err?.error?.message || 'Failed to change user status.');
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
