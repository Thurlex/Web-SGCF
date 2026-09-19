import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
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

interface EmployeeRequest {
  name: string;
  cpf: string;
  dayOfBirth: string | null;
  languagesSpoken: string[];
}

@Component({
  selector: 'app-employees',
  imports: [CurrencyPipe, FormsModule, MdbFormsModule, MdbModalModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Employees {
  private readonly http = inject(HttpClient);
  private readonly modalService = inject(MdbModalService);
  private readonly apiUrl = '/api/employee';

  @ViewChild('modalEmployee') modalEmployee!: TemplateRef<any>;

  modalRef!: MdbModalRef<any>;

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly feedback = signal('');
  protected readonly searchTerm = signal('');
  protected readonly employeeToDeactivate = signal<Employee | null>(null);
  protected readonly deactivating = signal(false);
  protected readonly formError = signal('');
  protected readonly saving = signal(false);
  protected readonly saveError = signal('');

  protected readonly name = signal('');
  protected readonly cpf = signal('');
  protected readonly dayOfBirth = signal('');
  protected readonly languagesSpoken = signal<string[]>([]);

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

  protected openForm(): void {
    this.name.set('');
    this.cpf.set('');
    this.dayOfBirth.set('');
    this.languagesSpoken.set([]);
    this.saveError.set('');

    this.modalRef = this.modalService.open(this.modalEmployee);
  }

  protected setCpf(value: string): void {
    this.cpf.set(value.replace(/\D/g, '').slice(0, 11));
  }

  protected isFormValid(): boolean {
    return Boolean(this.name().trim()) && this.isCpfValid(this.cpf());
  }

  private isCpfValid(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf) || /^([0-9])\1{10}$/.test(cpf)) {
      return false;
    }

    const digits = cpf.split('').map(Number);
    const firstCheckDigit = this.calculateCpfCheckDigit(digits.slice(0, 9));
    const secondCheckDigit = this.calculateCpfCheckDigit(digits.slice(0, 10));

    return digits[9] === firstCheckDigit && digits[10] === secondCheckDigit;
  }

  private calculateCpfCheckDigit(digits: number[]): number {
    const weightStart = digits.length + 1;
    const sum = digits.reduce((total, digit, index) => total + digit * (weightStart - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  }

  protected toggleLanguage(language: string): void {
    const languages = this.languagesSpoken();

    if (languages.includes(language)) {
      this.languagesSpoken.set(
        languages.filter((item) => item !== language)
      );
    } else {
      this.languagesSpoken.set([...languages, language]);
    }
  }

  protected cancelForm(): void {
    if (!this.saving()) {
      this.modalRef.close();
    }
  }

  protected addEmployee(): void {
    if (!this.isFormValid()) {
      this.saveError.set('Informe o nome e um CPF válido com 11 dígitos.');
      return;
    }

    const employee: EmployeeRequest = {
      name: this.name().trim(),
      cpf: this.cpf(),
      dayOfBirth: this.dayOfBirth() || null,
      languagesSpoken: this.languagesSpoken()
    };

    this.saving.set(true);
    this.saveError.set('');

    this.http
      .post(`${this.apiUrl}/save`, employee, {
        responseType: 'text'
      })
      .pipe(
        catchError((error) => {
          this.saveError.set(error.status === 400
            ? 'Verifique o nome e o CPF informado.'
            : 'Não foi possível cadastrar o funcionário.');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((response) => {
        if (response !== null) {
          this.modalRef.close();
          this.feedback.set('Funcionário cadastrado com sucesso.');
          this.loadEmployees();
        }
      });
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