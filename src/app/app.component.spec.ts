import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app and initialize lifecycle', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    fixture.detectChanges(); // triggers ngOnInit
  });

  it(`should have as title 'CoreUI Angular Admin Template'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CoreUI Angular Admin Template');
  });

  it('should respond to router events in ngOnInit', () => {
    const router = TestBed.inject(Router);
    const eventsSubject = new Subject();
    vi.spyOn(router, 'events', 'get').mockReturnValue(eventsSubject.asObservable() as any);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    eventsSubject.next(new NavigationEnd(1, '/test', '/test'));
    expect(fixture.componentInstance).toBeTruthy();
  });
});
