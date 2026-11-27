import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  CalendarDays,
  CircleGauge,
  Map,
  Menu,
  LogOut,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  UserRound,
  UsersRound,
} from 'lucide';
import { AppIcon } from '../shared/app-icon';
import { AuthService, AuthenticatedUser } from '../service/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-layout',
  imports: [AppIcon, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Layout {
  protected readonly isManager = signal(false);
  protected readonly currentUser = signal<AuthenticatedUser | null>(null);
  protected readonly sidebarOpen = signal(false);
  protected readonly sidebarCollapsed = signal(false);

  protected readonly icons = {
    CalendarDays,
    CircleGauge,
    Map,
    Menu,
    LogOut,
    ScrollText,
    PanelLeftClose,
    PanelLeftOpen,
    Target,
    UserRound,
    UsersRound,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.authService.session().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isManager.set(user.permission === 'MANAGER');
      },
      error: () => {
        this.currentUser.set(null);
        this.isManager.set(false);
      },
    });
  }

  protected closeMobileSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected userInitials(): string {
    const userName = this.currentUser()?.userName?.trim();

    if (!userName) {
      return 'U';
    }

    return userName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  protected toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected logout(): void {
    Swal.fire({
      title: "Deseja sair do sistema?",
      showCancelButton: true,
      confirmButtonText: "Sair",
      cancelButtonText : "Cancelar"
    }).then((result) => {
        if (result.isConfirmed){
          Swal.fire("Voce saiu do sistema");
          this.authService.logout();
          this.router.navigate(["/login"]);
        }
    });
  }
}
