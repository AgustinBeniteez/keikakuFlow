import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoSizeClasses {
  icon: string;
  brand: string;
  flow: string;
}

const LOGO_SIZE_MAP: Record<LogoSize, LogoSizeClasses> = {
  sm: {
    icon: 'h-7',
    brand: 'text-[1.25rem] ml-0.5',
    flow: 'text-[1.375rem] ml-1',
  },
  md: {
    icon: 'h-12',
    brand: 'text-[2.125rem] ml-1',
    flow: 'text-[2.375rem] ml-1.5',
  },
  lg: {
    icon: 'h-16',
    brand: 'text-[2.85rem] ml-1.5',
    flow: 'text-[3.15rem] ml-2',
  },
};

/** Logotipo reutilizable de KeikakuFlow (isotipo K + wordmark tipográfico). */
@Component({
  selector: 'kf-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-baseline select-none',
    role: 'img',
    'aria-label': 'KeikakuFlow',
  },
  template: `
    <img
      src="assets/logo.svg"
      alt=""
      aria-hidden="true"
      [class]="'w-auto shrink-0 ' + sizeClasses().icon"
    />
    @if (showWordmark()) {
      <span
        aria-hidden="true"
        [class]="'font-brand font-normal tracking-[-0.02em] leading-none text-text-main ' + sizeClasses().brand"
      >
        eikaku
      </span>
      <span
        aria-hidden="true"
        [class]="'font-serif font-normal italic leading-none text-brand-gradient pr-[0.08em] ' + sizeClasses().flow"
      >
        flow
      </span>
    }
  `,
})
export class LogoComponent {
  readonly size = input<LogoSize>('md');
  readonly showWordmark = input(true);

  protected readonly sizeClasses = computed(() => LOGO_SIZE_MAP[this.size()]);
}
