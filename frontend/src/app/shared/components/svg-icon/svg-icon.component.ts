import { Component, computed, input } from '@angular/core';

export type SpriteIconName =
  // Fondos decorativos
  | 'bg-folder'
  | 'bg-search'
  | 'bg-logo-k'
  // Iconografía Figma UI (37 iconos del sistema de diseño)
  | 'icon-home'
  | 'icon-plus'
  | 'icon-search'
  | 'icon-bell'
  | 'icon-user'
  | 'icon-chevron-down'
  | 'icon-hash'
  | 'icon-settings'
  | 'icon-notification'
  | 'icon-users'
  | 'icon-pin'
  | 'icon-help-circle'
  | 'icon-smile'
  | 'icon-more-horizontal'
  | 'icon-image'
  | 'icon-at-sign'
  | 'icon-send'
  | 'icon-arrow-left'
  | 'icon-more-vertical'
  | 'icon-shield'
  | 'icon-premium'
  | 'icon-ticket'
  | 'icon-trash-2'
  | 'icon-x'
  | 'icon-calendar'
  | 'icon-file-text'
  | 'icon-network'
  | 'icon-check'
  | 'icon-layout-grid'
  | 'icon-list'
  | 'icon-arrow-up-right'
  | 'icon-chevron-left'
  | 'icon-chevron-right'
  | 'icon-message-circle'
  | 'icon-alarm-clock'
  | 'icon-flag'
  | 'icon-rocket'
  // Aliases de compatibilidad
  | 'icon-close'
  | 'icon-clock'
  | 'icon-trash'
  // Iconografía de utilidad general
  | 'icon-sun'
  | 'icon-moon'
  | 'icon-logout'
  | 'icon-palette'
  | 'icon-globe'
  | 'icon-mail'
  | 'icon-lock'
  | 'icon-eye'
  | 'icon-eye-off'
  | 'icon-alert-circle'
  | 'icon-building';

@Component({
  selector: 'kf-icon',
  standalone: true,
  host: {
    class: 'inline-block shrink-0',
  },
  template: `
    <svg class="block w-full h-full" aria-hidden="true">
      <use [attr.href]="symbolHref()"></use>
    </svg>
  `,
})
export class SvgIconComponent {
  readonly name = input.required<SpriteIconName>();

  protected readonly symbolHref = computed(() => `assets/icons/sprite.svg#${this.name()}`);
}
