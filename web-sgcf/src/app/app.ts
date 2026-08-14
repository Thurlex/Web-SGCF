import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  CalendarDays,
  ChartNoAxesCombined,
  CircleGauge,
  Map,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  UserRound,
  UsersRound,
} from 'lucide';
import { AppIcon } from './shared/app-icon';

@Component({
  selector: 'app-root',
  imports: [AppIcon, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly sidebarOpen = signal(false);
  protected readonly sidebarCollapsed = signal(false);
  protected readonly icons = {
    CalendarDays,
    ChartNoAxesCombined,
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
