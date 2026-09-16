import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ButtonDirective,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormControlDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [
    AvatarComponent,
    BadgeComponent,
    BreadcrumbRouterComponent,
    ButtonDirective,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormControlDirective,
    HeaderNavComponent,
    HeaderTogglerDirective,
    IconDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgTemplateOutlet,
    SidebarToggleDirective,
    FormsModule
  ]
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly authService = inject(AuthService);

  readonly colorMode = this.#colorModeService.colorMode;
  readonly sidebarId = input('sidebar1');

  readonly tenantModalVisible = signal(false);
  tenantInput = signal(this.authService.getTenantId() ?? '');

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find((mode) => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor() {
    super();
  }

  openTenantModal(): void {
    this.tenantInput.set(this.authService.getTenantId() ?? '');
    this.tenantModalVisible.set(true);
  }

  saveTenant(): void {
    const val = this.tenantInput().trim();
    if (val) {
      this.authService.setTenantId(val);
    }
    this.tenantModalVisible.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
