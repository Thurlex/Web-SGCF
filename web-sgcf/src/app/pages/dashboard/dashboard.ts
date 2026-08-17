import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

interface Customer {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Tour {
  nameOfTour: string;
  locations: string;
}

interface Reservation {
  id: number;
  date: string;
  tour: Tour | null;
  customer: Customer | null;
  employee: Employee | null;
  value: number;
  status: string;
}

interface Quota {
  id: number;
  startDate: string;
  endDate: string;
  targetValue: number;
  employee: Employee | null;
}

interface DashboardData {
  customers: Customer[];
  employees: Employee[];
  tours: Tour[];
  reservations: Reservation[];
  quotas: Quota[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly data = signal<DashboardData>({
    customers: [],
    employees: [],
    tours: [],
    reservations: [],
    quotas: [],
  });

  protected readonly totalReservationValue = computed(() =>
    this.data().reservations.reduce((total, reservation) => total + reservation.value, 0),
  );
  protected readonly activeQuotas = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return this.data().quotas.filter((quota) => quota.startDate <= today && quota.endDate >= today).length;
  });
  protected readonly recentReservations = computed(() =>
    [...this.data().reservations]
      .sort((first, second) => second.date.localeCompare(first.date))
      .slice(0, 6),
  );

  constructor() {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.loading.set(true);
    this.hasError.set(false);

    forkJoin({
      customers: this.loadCollection<Customer>('/customer/findAll/active'),
      employees: this.loadCollection<Employee>('/Employee/findAll/active'),
      tours: this.loadCollection<Tour>('/Tour/findAll/active'),
      reservations: this.loadCollection<Reservation>('/Reservation/findAll'),
      quotas: this.loadCollection<Quota>('/Quota/findAll'),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((data) => this.data.set(data));
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmada',
      CANCELLED: 'Cancelada',
      COMPLETED: 'Concluída',
      ACTIVE: 'Ativa',
      INACTIVE: 'Inativa',
    };

    return labels[status.toUpperCase()] ?? status.replaceAll('_', ' ');
  }

  protected statusClass(status: string): string {
    return `status-${status.toLowerCase().replaceAll('_', '-')}`;
  }

  private loadCollection<T>(path: string) {
    return this.http.get<T[]>(`${this.apiUrl}${path}`).pipe(
      catchError(() => {
        this.hasError.set(true);
        return of([] as T[]);
      }),
    );
  }
}