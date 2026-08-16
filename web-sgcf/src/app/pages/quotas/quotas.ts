import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService, AuthenticatedUser } from '../../service/auth.service';

interface Employee {
  id: number;
  name: string;
}

interface QuotaProgress {
  id: number;
  startDate: string;
  endDate: string;
  targetValue: number;
  achievedValue: number;
  employee: Employee | null;
}

interface QuotaForm {
  employeeId: number | null;
  targetValue: number | null;
  startDate: string;
}

@Component({
  selector: 'app-quotas',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './quotas.html',
  styleUrl: './quotas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Quotas {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = '/api/Quota';

  protected readonly quotas = signal<QuotaProgress[]>([]);
  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly feedback = signal('');
  protected readonly formError = signal('');
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly editingCompany = signal(false);
  protected readonly currentUser = signal<AuthenticatedUser | null>(null);

  protected form: QuotaForm = this.emptyForm();

  constructor() {
    this.auth.session().pipe(catchError(() => of(null))).subscribe((user) => {
      this.currentUser.set(user);
      this.loadQuotas();
    });
  }

  protected loadQuotas(): void {
    this.loading.set(true);
    this.hasError.set(false);

    forkJoin({
      quotas: this.http.get<QuotaProgress[]>(`${this.apiUrl}/findAll/progress`),
      employees: this.http.get<Employee[]>('/api/Employee/findAll/active'),
    })
      .pipe(
        catchError(() => {
          this.hasError.set(true);
          return of({ quotas: this.quotas(), employees: this.employees() });
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => {
        this.quotas.set(data.quotas);
        this.employees.set(data.employees);
      });
  }

  protected openCompanyForm(): void {
    if (!this.isManager()) {
      this.feedback.set('Somente um gerente pode alterar a meta da empresa.');
      return;
    }
    const companyQuota = this.companyQuota();
    if (!companyQuota) {
      return;
    }

    this.editingId.set(companyQuota.id);
    this.editingCompany.set(true);
    this.form = {
      employeeId: null,
      targetValue: companyQuota.targetValue,
      startDate: companyQuota.startDate,
    };
    this.resetFormMessages();
    this.showForm.set(true);
  }

  protected openEmployeeForm(): void {
    if (!this.canCreateEmployeeQuota()) {
      this.formError.set('É necessário iniciar uma sessão para criar uma meta.');
      return;
    }
    if (this.currentUser()?.permission === 'Employee' && this.currentUser()?.employeeId === null) {
      this.formError.set('Seu usuário ainda não está vinculado a um funcionário.');
      return;
    }
    this.editingId.set(null);
    this.editingCompany.set(false);
    this.form = this.emptyForm();
    if (this.currentUser()?.permission === 'Employee') {
      this.form.employeeId = this.currentUser()?.employeeId ?? null;
    }
    this.resetFormMessages();
    this.showForm.set(true);
  }

  protected closeForm(): void {
    if (!this.saving()) {
      this.showForm.set(false);
    }
  }

  protected saveQuota(): void {
    const validationError = this.validateForm();
    if (validationError) {
      this.formError.set(validationError);
      return;
    }

    this.saving.set(true);
    this.formError.set('');
    this.feedback.set('');

    const id = this.editingId();
    const request = this.editingCompany()
      ? this.http.patch(`${this.apiUrl}/updatePatch/${id}`, { targetValue: this.form.targetValue }, { responseType: 'text' })
      : this.http.post(`${this.apiUrl}/save`, {
          employeeId: this.form.employeeId,
          targetValue: this.form.targetValue,
          startDate: this.form.startDate,
        }, { responseType: 'text' });

    request
      .pipe(
        catchError(() => {
          this.formError.set('Não foi possível salvar a meta. Verifique o valor e tente novamente.');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((response) => {
        if (response === null) {
          return;
        }
        this.showForm.set(false);
        this.feedback.set(this.editingCompany() ? 'Meta da empresa atualizada.' : 'Meta do funcionário criada.');
        this.loadQuotas();
      });
  }

  protected companyQuota(): QuotaProgress | undefined {
    return this.quotas().find((quota) => quota.employee === null);
  }

  protected employeeQuotas(): QuotaProgress[] {
    const user = this.currentUser();
    return this.quotas().filter((quota) => quota.employee !== null &&
      (user?.permission === 'Manager' || quota.employee?.id === user?.employeeId));
  }

  protected isManager(): boolean {
    return this.currentUser()?.permission === 'Manager';
  }

  protected canCreateEmployeeQuota(): boolean {
    const user = this.currentUser();
    return user?.permission === 'Manager' || user?.employeeId != null;
  }

  protected progressPercent(quota: QuotaProgress): number {
    if (quota.targetValue <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((quota.achievedValue / quota.targetValue) * 100));
  }

  protected remainingValue(quota: QuotaProgress): number {
    return Math.max(0, quota.targetValue - quota.achievedValue);
  }

  protected quotaState(quota: QuotaProgress): string {
    const today = this.today();
    if (today < quota.startDate) {
      return 'Programada';
    }
    if (quota.achievedValue >= quota.targetValue) {
      return 'Atingida';
    }
    if (today > quota.endDate) {
      return 'Encerrada';
    }
    return 'Em andamento';
  }

  protected stateClass(quota: QuotaProgress): string {
    return this.quotaState(quota).toLowerCase().replaceAll(' ', '-');
  }

  private validateForm(): string {
    const targetValue = this.form.targetValue;
    if (targetValue === null || !Number.isFinite(targetValue)) {
      return 'Informe um valor válido para a meta.';
    }
    if (this.editingCompany() && targetValue < 5000) {
      return 'A meta da empresa deve ser de pelo menos R$ 5.000,00.';
    }
    if (!this.editingCompany() && (this.form.employeeId === null || targetValue < 100 || targetValue > 10000)) {
      return 'Selecione um funcionário e informe uma meta entre R$ 100,00 e R$ 10.000,00.';
    }
    return '';
  }

  private emptyForm(): QuotaForm {
    return { employeeId: null, targetValue: null, startDate: this.today() };
  }

  private resetFormMessages(): void {
    this.formError.set('');
    this.feedback.set('');
  }

  private today(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
