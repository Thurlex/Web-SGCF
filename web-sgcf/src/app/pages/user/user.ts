import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService, AuthenticatedUser } from '../../service/auth.service';

interface User {
  id: number;
  userName: string;
  permission: string;
  email: string;
  employeeId: number | null;
}

interface Employee {
  id: number;
  name: string;
}

interface UserRequest {
  userName: string;
  userPassword: string;
  permission: string;
  email: string;
  employeeId: number | null;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrl: './user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/user';
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly users = signal<User[]>([]);
  protected readonly employees = signal<Employee[]>([]);
  protected readonly showForm = signal(false);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly userName = signal('');
  protected readonly userPassword = signal('');
  protected readonly permission = signal('Employee');
  protected readonly email = signal('');
  protected readonly employeeId = signal<number | null>(null);
  protected setEmployeeId(value: string): void {
    this.employeeId.set(value ? +value : null);
  }
  protected readonly currentUser = signal<AuthenticatedUser | null>(null);

  constructor() {
    this.loadUser();
    this.loadEmployees();
    this.loadCurrentUser();
  }

  protected loadEmployees(): void {
    this.http.get<Employee[]>('/api/employee/findAll/active').subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.hasError.set(true),
    });
  }

  protected availableEmployees(): Employee[] {
    const linkedEmployeeIds = new Set(
      this.users()
        .map((user) => user.employeeId)
        .filter((id): id is number => id !== null),
    );

    return this.employees().filter((employee) => !linkedEmployeeIds.has(employee.id));
  }

  protected employeeName(employeeId: number | null): string {
    if (employeeId === null) {
      return 'Não vinculado';
    }

    return this.employees().find((employee) => employee.id === employeeId)?.name ?? 'Não encontrado';
  }

  protected loadUser(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.http
      .get<User[]>(`${this.apiUrl}/findAll/active`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar usuários:', error);
          console.error('Status:', error.status);
          console.error('Resposta do servidor:', error.url);
          console.error('respostado servidor:', error.error);
          this.hasError.set(true);
          return of([] as User[]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((data) => {
        this.users.set(data);
      });
  }

  protected openForm(): void {
    this.clearForm();
    this.formError.set('');
    this.showForm.set(true);
  }

  protected cancelForm(): void {
    if (!this.saving()) {
      this.showForm.set(false);
      this.clearForm();
      this.formError.set('');
    }
  }

  protected addUser(): void {
    if (!this.userName().trim() || !this.userPassword() || !this.email().trim()
      || (this.permission() === 'Employee' && this.employeeId() === null)) {
      this.formError.set('Preencha todos os campos e selecione um funcionário para a conta.');
      return;
    }

    const user: UserRequest = {
      userName: this.userName().trim(),
      userPassword: this.userPassword(),
      permission: this.permission(),
      email: this.email().trim(),
      employeeId: this.permission() === 'Employee' ? this.employeeId() : null,
    };

    this.saving.set(true);
    this.formError.set('');

    this.http
      .post(`${this.apiUrl}/save`, user, {
        responseType: 'text'
      })
      .subscribe({
        next: () => {
          this.showForm.set(false);
          this.clearForm();
          this.loadUser();
        },
        error: (error) => {
          this.formError.set(error.status === 409
            ? 'Este funcionário já possui uma conta vinculada.'
            : error.status === 404
              ? 'O funcionário selecionado não foi encontrado.'
              : 'Não foi possível cadastrar a conta. Verifique os dados informados.');
          this.saving.set(false);
        },
        complete: () => this.saving.set(false),
      });
  }

  protected removeUser(id: number): void {
    this.http
      .delete(`${this.apiUrl}/delete/${id}`, {
        responseType: 'text'
      })
      .subscribe({
        next: () => {
          this.users.update(users =>
            users.filter(user => user.id !== id)
          );
        },
        error: (error) => {
          console.error('Erro ao remover usuário:', error);
        }
      });
  }

  protected loadCurrentUser(): void {
  this.authService.session().subscribe({
    next: (user) => {
      this.currentUser.set(user);
    },
    error: (error) => {
      console.error('Erro ao carregar usuário logado:', error);
    }
  });
}

  private clearForm(): void {
    this.userName.set('');
    this.userPassword.set('');
    this.permission.set('Employee');
    this.email.set('');
    this.employeeId.set(null);
  }
}
