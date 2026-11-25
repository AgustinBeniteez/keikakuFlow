import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ThemeService } from '../../../core/services/theme.service';

describe('LoginComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    TestBed.inject(ThemeService).setTheme('light');
  });

  it('should render decorative background SVGs without a form or language switcher', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('form')).toBeNull();
    expect(el.querySelectorAll('kf-icon').length).toBe(4);
    expect(el.textContent).toContain('flow');
  });

  it('should toggle dark mode when clicking the theme button', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const themeBtn = el.querySelector('button') as HTMLButtonElement;
    expect(themeBtn.getAttribute('aria-label')).toBe('Modo oscuro');

    themeBtn.click();
    fixture.detectChanges();

    expect(themeService.theme()).toBe('dark');
    expect(themeBtn.getAttribute('aria-label')).toBe('Modo claro');
  });
});
