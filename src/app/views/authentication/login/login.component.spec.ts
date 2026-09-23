import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { LoginComponent } from './login.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { AuthService } from '../../../core/services/auth.service';
import { TokenResponse } from '../../../core/models/auth.models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let iconSetService: IconSetService;
  let authServiceSpy: {
    login: ReturnType<typeof vi.fn>;
    bypassLogin: ReturnType<typeof vi.fn>;
  };
  let routerSpy: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn(),
      bypassLogin: vi.fn()
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FormModule, CardModule, GridModule, ButtonModule, IconModule, LoginComponent],
      providers: [
        IconSetService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.togglePassword();
    expect(component.showPassword).toBe(true);
    component.togglePassword();
    expect(component.showPassword).toBe(false);
  });

  it('should bypass login and navigate to dashboard', () => {
    component.onBypass();
    expect(authServiceSpy.bypassLogin).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error when email or password is missing on submit', () => {
    component.email = '';
    component.password = '';
    component.onSubmit();
    expect(component.errorMessage()).toBe('Please enter both email and password.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login and navigate to dashboard on success', () => {
    component.email = 'admin@uwati.org';
    component.password = 'Secret123';
    component.tenantId = 'tenant-1';

    authServiceSpy.login.mockReturnValue(of({ accessToken: 'tok' } as TokenResponse));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@uwati.org',
      password: 'Secret123',
      tenantId: 'tenant-1'
    });
    expect(component.isLoading()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message when authService.login fails', () => {
    component.email = 'admin@uwati.org';
    component.password = 'Wrong';

    authServiceSpy.login.mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid credentials' }
      }))
    );

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid credentials');
  });

  it('should fallback to default error message when error object has no message', () => {
    component.email = 'admin@uwati.org';
    component.password = 'Wrong';

    authServiceSpy.login.mockReturnValue(throwError(() => ({})));

    component.onSubmit();

    expect(component.errorMessage()).toBe(
      'Authentication failed. Please check your credentials and tenant ID.'
    );
  });
});
