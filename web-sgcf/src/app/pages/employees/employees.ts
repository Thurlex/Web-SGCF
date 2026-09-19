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

    this.modalRef = this.modalService.open(this.modalEmployee);
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
    this.modalRef.close();
  }

  protected addEmployee(): void {
    const employee = {
      name: this.name(),
      cpf: this.cpf(),
      dayOfBirth: this.dayOfBirth(),
      languagesSpoken: this.languagesSpoken()
    };

    this.http
      .post(`${this.apiUrl}/save`, employee, {
        responseType: 'text'
      })
      .subscribe({
        next: () => {
          this.modalRef.close();
          this.loadEmployees();
        },
        error: () => {
          alert('Não foi possível cadastrar o funcionário.');
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