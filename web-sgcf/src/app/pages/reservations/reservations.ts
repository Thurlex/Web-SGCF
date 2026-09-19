import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

interface Tour {
  id: number;
  price: number;
  nameOfTour: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
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

interface ReservationRequest {
  date: string;
  tourId: number;
  customerId: number;
  employeeId: number;
  value: number;
  status: string;
}

type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, FormsModule, MdbFormsModule, MdbModalModule]
})
export class Reservations {
  private readonly http = inject(HttpClient);
  private readonly modalService = inject(MdbModalService);
  private readonly apiUrl = '/api/reservation';

  @ViewChild('modalReservation') modalReservation!: TemplateRef<any>;

  modalRef!: MdbModalRef<any>;

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly reservations = signal<Reservation[]>([]);
  protected readonly showForm = signal(false);

  protected readonly tours = signal<Tour[]>([]);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly employees = signal<Employee[]>([]);

  protected readonly date = signal('');
  protected readonly tourId = signal<number | null>(null);
  protected readonly customerId = signal<number | null>(null);
  protected readonly employeeId = signal<number | null>(null);
  protected readonly value = signal(0);
  protected readonly status = signal('Pending');
  protected readonly saving = signal(false);
  protected readonly updatingStatus = signal<number | null>(null);
  protected readonly formError = signal('');

  constructor() {
    this.loadTours();
    this.loadCustomers();
    this.loadEmployees();
    this.loadReservations();
  }

  protected loadReservations(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.http
      .get<Reservation[]>(`${this.apiUrl}/findAll`)
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar reservas:', error);
          this.hasError.set(true);
          return of([] as Reservation[]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(data => {
        console.log('Reservas:', data);
        this.reservations.set(data);
      });
  }

  protected getCustomerName(id: number): string {
    const customer = this.customers().find(customer => customer.id === id);
    return customer?.name ?? 'Não encontrado';
  }

  protected getEmployeeName(id: number): string {
    const employee = this.employees().find(employee => employee.id === id);
    return employee?.name ?? 'Não encontrado';
  }

  protected getTourName(id: number): string {
    const tour = this.tours().find(tour => tour.id === id);
    return tour?.nameOfTour ?? 'Não encontrado';
  }

  protected openForm(): void {
    this.clearForm();
    this.formError.set('');
    this.showForm.set(true);
    this.modalRef = this.modalService.open(this.modalReservation);
  }

  protected cancelForm(): void {
    this.showForm.set(false);
    this.clearForm();

    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  private loadTours(): void {
    this.http
      .get<Tour[]>('/api/tour/findAll')
      .subscribe({
        next: data => {
          console.log('Tours:', data);
          this.tours.set(data);
        },
        error: error => {
          console.error('Erro ao carregar passeios:', error);
        }
      });
  }

  private loadCustomers(): void {
    this.http
      .get<Customer[]>('/api/customer/findAll')
      .subscribe({
        next: data => {
          console.log('Clientes:', data);
          this.customers.set(data);
        },
        error: error => {
          console.error('Erro ao carregar clientes:', error);
        }
      });
  }

  private loadEmployees(): void {
    this.http
      .get<Employee[]>('/api/employee/findAll')
      .subscribe({
        next: data => {
          console.log('Funcionários:', data);
          this.employees.set(data);
        },
        error: error => {
          console.error('Erro ao carregar funcionários:', error);
        }
      });
  }

  protected selectTour(id: string): void {
    const selectedId = id ? Number(id) : null;

    this.tourId.set(selectedId);

    if (selectedId === null) {
      this.value.set(0);
      return;
    }

    const tour = this.tours().find(tour => tour.id === selectedId);

    if (tour) {
      this.value.set(tour.price);
    }
  }

  protected addReservation(): void {
    const tourId = this.tourId();
    const customerId = this.customerId();
    const employeeId = this.employeeId();

    if (!this.date()) {
      alert('Selecione uma data.');
      return;
    }

    if (tourId === null) {
      alert('Selecione um passeio.');
      return;
    }

    if (customerId === null) {
      alert('Selecione um cliente.');
      return;
    }

    if (employeeId === null) {
      alert('Selecione um funcionário.');
      return;
    }

    const reservation: ReservationRequest = {
      date: this.date(),
      tourId,
      customerId,
      employeeId,
      value: this.value(),
      status: this.status()
    };

    this.saving.set(true);
    this.formError.set('');

    this.http
      .post(`${this.apiUrl}/save`, reservation, {
        responseType: 'text'
      })
      .subscribe({
        next: response => {
          console.log('Reserva criada:', response);
          this.showForm.set(false);
          this.clearForm();
          this.modalRef.close();
          this.loadReservations();
        },
        error: error => {
          this.formError.set('Não foi possível cadastrar a reserva. Verifique os dados informados.');
          this.saving.set(false);
        },
        complete: () => this.saving.set(false),
      });
  }

  protected updateStatus(reservation: Reservation, nextStatus: string): void {
    const status = nextStatus as ReservationStatus;

    if (status === reservation.status) {
      return;
    }

    this.updatingStatus.set(reservation.id);
    this.http.patch<Reservation>(`${this.apiUrl}/updateStatus/${reservation.id}`, { status }).subscribe({
      next: (updatedReservation) => {
        this.reservations.update((reservations) => reservations.map((item) =>
          item.id === updatedReservation.id ? updatedReservation : item,
        ));
      },
      error: () => {
        this.loadReservations();
        this.updatingStatus.set(null);
      },
      complete: () => this.updatingStatus.set(null),
    });
  }

  protected removeReservation(id: number): void {
    if (!confirm('Deseja realmente excluir esta reserva?')) {
      return;
    }

    this.http
      .delete(`${this.apiUrl}/delete/${id}`, {
        responseType: 'text'
      })
      .subscribe({
        next: () => {
          this.reservations.update(reservations =>
            reservations.filter(reservation => reservation.id !== id)
          );
        },
        error: error => {
          console.error('Erro ao remover reserva:', error);
          alert('Não foi possível remover a reserva.');
        }
      });
  }

  private clearForm(): void {
    this.date.set('');
    this.tourId.set(null);
    this.customerId.set(null);
    this.employeeId.set(null);
    this.value.set(0);
    this.status.set('Pending');
  }

  protected translateStatus(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Pendente';
      case 'Confirmed':
        return 'Confirmada';
      case 'Cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }
}