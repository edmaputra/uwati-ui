import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertComponent,
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
import { ScopeNode, CreateScopeNodeRequest } from '../../../core/models/iam.models';

@Component({
  selector: 'app-scopes',
  templateUrl: './scopes.component.html',
  imports: [
    CommonModule,
    FormsModule,
    AlertComponent,
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
export class ScopesComponent implements OnInit {
  private iamService = inject(IamService);

  scopeNodes = signal<ScopeNode[]>([]);
  flatScopes = signal<ScopeNode[]>([]);

  isLoading = signal(false);
  isSubmitting = signal(false);
  alertMessage = signal<{ type: string; text: string } | null>(null);

  // Create Modal
  createModalVisible = signal(false);
  newScope: CreateScopeNodeRequest = {
    parentId: undefined,
    code: '',
    name: ''
  };

  ngOnInit(): void {
    this.loadScopes();
  }

  loadScopes(): void {
    this.isLoading.set(true);
    this.iamService.listScopes().subscribe({
      next: (list) => {
        this.flatScopes.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to load scope hierarchy.');
      }
    });
  }

  openCreateModal(): void {
    this.newScope = { parentId: undefined, code: '', name: '' };
    this.createModalVisible.set(true);
  }

  submitCreate(): void {
    if (!this.newScope.code || !this.newScope.name) {
      this.showAlert('warning', 'Code and Name are required fields.');
      return;
    }

    this.isSubmitting.set(true);
    const payload: CreateScopeNodeRequest = {
      parentId: this.newScope.parentId || undefined,
      code: this.newScope.code.trim(),
      name: this.newScope.name.trim()
    };

    this.iamService.createScope(payload).subscribe({
      next: (scope) => {
        this.isSubmitting.set(false);
        this.createModalVisible.set(false);
        this.showAlert('success', `Scope '${scope.name}' created.`);
        this.loadScopes();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.showAlert('danger', err?.error?.message || 'Failed to create scope node.');
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
