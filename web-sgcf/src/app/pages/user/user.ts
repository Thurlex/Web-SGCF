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
}

interface UserRequest {
  userName: string;
  userPassword: string;
  permission: string;
  email: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrl: './user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/User';
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly users = signal<User[]>([]);
  protected readonly showForm = signal(false);

  protected readonly userName = signal('');
  protected readonly userPassword = signal('');
  protected readonly permission = signal('FUNCIONARIO');
  protected readonly email = signal('');
  protected readonly employeeId = signal<number | null>(null);
  protected setEmployeeId(value: string): void {
  this.employeeId.set(value ? +value : null);
}
  protected readonly currentUser = signal<AuthenticatedUser | null>(null);

  constructor() {
    this.loadUser();
    this.currentUser();
  }

  protected loadUser(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.http
      .get<User[]>(`${this.apiUrl}/findAll/active`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar usuários:', error);
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
    this.showForm.set(true);
  }

  protected cancelForm(): void {
    this.showForm.set(false);
    this.clearForm();
  }

  protected addUser(): void {
    const user: UserRequest = {
      userName: this.userName(),
      userPassword: this.userPassword(),
      permission: this.permission(),
      email: this.email(),
    };

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
          console.error('Erro ao adicionar usuário:', error);
          console.error('Status:', error.status);
          console.error('Resposta do servidor:', error.error);
        }
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
    this.permission.set('FUNCIONARIO');
    this.email.set('');
    this.employeeId.set(null);
  }
}