import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LogoComponent, LogoSize } from './logo.component';

@Component({
  standalone: true,
  imports: [LogoComponent],
  template: `<kf-logo [size]="size()" [showWordmark]="showWordmark()" />`,
})
class TestHostComponent {
  readonly size = signal<LogoSize>('md');
  readonly showWordmark = signal(true);
}

describe('LogoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should render K icon and eikaku flow wordmark by default', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const hostEl: HTMLElement = fixture.nativeElement;
    const logoEl = hostEl.querySelector('kf-logo') as HTMLElement;
    const img = logoEl.querySelector('img') as HTMLImageElement;

    expect(logoEl.getAttribute('aria-label')).toBe('KeikakuFlow');
    expect(img.getAttribute('src')).toBe('assets/logo.svg');
    expect(logoEl.textContent).toContain('eikaku');
    expect(logoEl.textContent).toContain('flow');
  });

  it('should hide wordmark when showWordmark is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showWordmark.set(false);
    fixture.detectChanges();

    const logoEl = fixture.nativeElement.querySelector('kf-logo') as HTMLElement;
    expect(logoEl.querySelector('img')).toBeTruthy();
    expect(logoEl.querySelectorAll('span').length).toBe(0);
  });

  it('should apply size classes for sm, md and lg', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('kf-logo img') as HTMLImageElement;
    expect(img.className).toContain('h-16');

    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();
    expect(img.className).toContain('h-7');
  });
});
