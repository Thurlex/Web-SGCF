import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  CalendarDays,
  CircleGauge,
  Map,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  UserRound,
  UsersRound,
} from 'lucide';
import { AppIcon } from '../shared/app-icon';

@Component({
  selector: 'app-layout',
  imports: [AppIcon, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Layout {
  protected readonly sidebarOpen = signal(false);
  protected readonly sidebarCollapsed = signal(false);

  protected readonly icons = {
    CalendarDays,
    CircleGauge,
    Map,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Target,
    UserRound,
    UsersRound,
  };

  protected closeMobileSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
