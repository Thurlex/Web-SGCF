import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize} from 'rxjs/operators';

interface Customer {
  id: number;
  cnpj: string;
  cpf: string;
  name: string;
  languageSpeak: string[];
  countryCustomer: string;
  email: string;
}

interface CustomerRequest {
  cnpj: string;
  cpf: string;
  name: string;
  languageSpeak: string[];
  countryCustomer: string;
  email: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Customers {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/customer';

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly showForm = signal(false);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly cpf = signal('');
  protected readonly cnpj = signal('');
  protected readonly countryCustomer = signal('Brazil');
  protected readonly languageSpeak = signal<string[]>([]);

  constructor() {
    this.loadCustomers();
  }

  protected loadCustomers(): void {
  this.loading.set(true);
  this.hasError.set(false);

  this.http
    .get<Customer[]>(`${this.apiUrl}/findAll`)
    .pipe(
      catchError(() => {
        this.hasError.set(true);
        return of([] as Customer[]);
      }),
      finalize(() => this.loading.set(false))
    )
    .subscribe((data) => this.customers.set(data));
}

protected openForm(): void {
  this.showForm.set(true);
}

protected cancelForm(): void {
  this.showForm.set(false);
}

protected toggleLanguage(language: string): void {
  const languages = this.languageSpeak();

  if (languages.includes(language)) {
    this.languageSpeak.set(
      languages.filter((item) => item !== language)
    );
  } else {
    this.languageSpeak.set([...languages, language]);
  }
}

protected addCustomer(): void {
  const customer: CustomerRequest = {
    cnpj: this.cnpj(),
    cpf: this.cpf(),
    name: this.name(),
    languageSpeak: this.languageSpeak(),
    countryCustomer: this.countryCustomer(),
    email: this.email()
  };

  this.http
    .post(`${this.apiUrl}/save`, customer, {
      responseType: 'text'
    })
    .subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Erro ao adicionar cliente:', error);
      }
    });
}

    }