import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

interface Employee {
  id: number;
  cpf: string;
  name: string;
  languagesSpoken: string[];
  active: boolean;
  tourAmount: number;
  cashReturn: number;
}

interface DeactivationForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-employees',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employees {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Employee';

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly feedback = signal('');
  protected readonly searchTerm = signal('');
  protected readonly employeeToDeactivate = signal<Employee | null>(null);
  protected readonly deactivating = signal(false);
  protected readonly formError = signal('');
  protected deactivationForm: DeactivationForm = { email: '', password: '' };

  constructor() {
    this.loadEmployees();
  }

  protected readonly filteredEmployees = () => {
    const term = this.searchTerm().trim().toLocaleLowerCase();
    return this.employees().filter((employee) => !term || employee.name.toLocaleLowerCase().includes(term));
  };

  protected loadEmployees(): void {
    this.loading.set(true);
    this.hasError.set(false);
    this.http.get<Employee[]>(`${this.apiUrl}/findAll`).pipe(
      catchError(() => {
        this.hasError.set(true);
        return of([] as Employee[]);
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe((employees) => this.employees.set(employees));
  }

  protected openDeactivation(employee: Employee): void {
    this.employeeToDeactivate.set(employee);
    this.formError.set('');
    this.deactivationForm = { email: '', password: '' };
  }

  protected closeDeactivation(): void {
    if (!this.deactivating()) {
      this.employeeToDeactivate.set(null);
    }
  }

  protected deactivateEmployee(): void {
    const employee = this.employeeToDeactivate();
    if (!employee || !this.deactivationForm.email.trim() || !this.deactivationForm.password) {
      this.formError.set('Informe o e-mail e a senha da conta atualmente conectada.');
      return;
    }

    this.deactivating.set(true);
    this.formError.set('');
    this.http.delete(`${this.apiUrl}/deactivate/${employee.id}`, {
      body: this.deactivationForm,
      responseType: 'text',
    }).pipe(
      catchError((error) => {
        this.formError.set(error.status === 401
          ? 'As credenciais informadas não são válidas.'
          : 'Não foi possível desativar este funcionário.');
        return of(null);
      }),
      finalize(() => this.deactivating.set(false)),
    ).subscribe((response) => {
      if (response !== null) {
        this.employeeToDeactivate.set(null);
        this.feedback.set('Funcionário desativado com sucesso.');
        this.loadEmployees();
      }
    });
  }
}