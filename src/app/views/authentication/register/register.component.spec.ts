import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let iconSetService: IconSetService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModule, FormModule, GridModule, ButtonModule, IconModule, RegisterComponent],
      providers: [IconSetService, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to check-email', () => {
    const mockForm = {
      value: { username: 'testuser', email: 'test@example.com' },
      valid: true
    } as unknown as NgForm;

    // Call protected method
    (component as unknown as { handleSubmit: (f: NgForm) => void }).handleSubmit(mockForm);

    expect(router.navigateByUrl).toHaveBeenCalledWith('/authentication/check-email');
  });
});
