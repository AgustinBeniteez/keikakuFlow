import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../shared/theme/theme.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, LogoComponent, SvgIconComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly activeTab = signal<AuthTab>('login');
  protected readonly showPassword = signal(false);

  protected setTab(tab: AuthTab): void {
    this.activeTab.set(tab);
    this.showPassword.set(false);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
  }
}
