import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  CalendarDays,
  CircleGauge,
  Map,
  Menu,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  UserRound,
  UsersRound,
} from 'lucide';
import { AppIcon } from '../shared/app-icon';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  imports: [AppIcon, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Layout {
  protected readonly sidebarOpen = signal(false);
  protected readonly sidebarCollapsed = signal(false);

  protected readonly icons = {
    CalendarDays,
    CircleGauge,
    Map,
    Menu,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Target,
    UserRound,
    UsersRound,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  protected closeMobileSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
