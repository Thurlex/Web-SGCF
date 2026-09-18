import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { of } from 'rxjs';
import { catchError, finalize} from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Customer, CustomerRequest } from '../../models/customer';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-customers',
  imports: [FormsModule, MdbFormsModule, MdbModalModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {
  private readonly customerService = inject(CustomerService);
  private readonly modalService = inject(MdbModalService);

  @ViewChild('modalCustomer') modalCustomer!: TemplateRef<any>;

  modalRef!: MdbModalRef<any>;

  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly customers = signal<Customer[]>([]);

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

    this.customerService
      .findAllActive()
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
    this.name.set('');
    this.email.set('');
    this.cpf.set('');
    this.cnpj.set('');
    this.countryCustomer.set('Brazil');
    this.languageSpeak.set([]);

    this.modalRef = this.modalService.open(this.modalCustomer);
  }

  protected cancelForm(): void {
    this.modalRef.close();
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

    this.customerService
      .save(customer)
      .subscribe({
        next: () => {
          this.modalRef.close();
          Swal.fire('Cliente cadastrado com sucesso.');
          this.loadCustomers();
        },
        error: () => Swal.fire('Nao foi possivel cadastrar o cliente. Verifique os dados.')
      });
  }

  protected removeCustomer(id: number): void {
    Swal.fire({
      title: 'Remover este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService
          .delete(id)
          .subscribe({
            next: () => {
              this.customers.update(customers =>
                customers.filter(customer => customer.id !== id)
              );
              Swal.fire('Cliente removido com sucesso.');
            },
            error: () => Swal.fire('Nao foi possivel remover o cliente.')
          });
      }
    });
  }
}
