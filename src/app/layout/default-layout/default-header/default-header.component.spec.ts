import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  DropdownModule,
  GridModule,
  HeaderModule,
  NavModule,
  ProgressModule,
  SidebarModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { DefaultHeaderComponent } from './default-header.component';
import { AuthService } from '../../../core/services/auth.service';

describe('DefaultHeaderComponent', () => {
  let component: DefaultHeaderComponent;
  let fixture: ComponentFixture<DefaultHeaderComponent>;
  let iconSetService: IconSetService;
  let authServiceSpy: {
    getTenantId: ReturnType<typeof vi.fn>;
    setTenantId: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    currentUser: ReturnType<typeof vi.fn>;
    activeTenantId: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceSpy = {
      getTenantId: vi.fn().mockReturnValue('tenant-curr'),
      setTenantId: vi.fn(),
      logout: vi.fn(),
      currentUser: vi.fn().mockReturnValue(null),
      activeTenantId: vi.fn().mockReturnValue('tenant-curr')
    };

    await TestBed.configureTestingModule({
      imports: [
        GridModule,
        HeaderModule,
        IconModule,
        NavModule,
        BadgeModule,
        AvatarModule,
        DropdownModule,
        BreadcrumbModule,
        SidebarModule,
        ProgressModule,
        ButtonGroupModule,
        ReactiveFormsModule,
        DefaultHeaderComponent
      ],
      providers: [
        IconSetService,
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(DefaultHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open tenant modal and populate current tenant ID', () => {
    component.openTenantModal();
    expect(component.tenantModalVisible()).toBe(true);
    expect(component.tenantInput()).toBe('tenant-curr');
  });

  it('should save tenant ID when tenantInput is non-empty', () => {
    component.tenantInput.set('tenant-new');
    component.saveTenant();
    expect(authServiceSpy.setTenantId).toHaveBeenCalledWith('tenant-new');
    expect(component.tenantModalVisible()).toBe(false);
  });

  it('should not set tenant ID when tenantInput is empty or whitespace', () => {
    component.tenantInput.set('   ');
    component.saveTenant();
    expect(authServiceSpy.setTenantId).not.toHaveBeenCalled();
    expect(component.tenantModalVisible()).toBe(false);
  });

  it('should call authService.logout when logout is invoked', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should compute appropriate icon based on color mode', () => {
    expect(component.icons()).toBeDefined();
  });
});
