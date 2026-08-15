import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

interface Tour {
  id: number;
  price: number;
  countryTour: string;
  kmOftour: number;
  nameOfTour: string;
  locations: string;
  reservationCount: number;
}

interface TourForm {
  price: number | null;
  countryTour: string;
  kmOftour: number | null;
  nameOfTour: string;
  locations: string;
}

@Component({
  selector: 'app-tours',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './tours.html',
  styleUrl: './tours.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tours {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Tour';

  protected readonly tours = signal<Tour[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly feedback = signal('');
  protected readonly formError = signal('');
  protected readonly editingId = signal<number | null>(null);
  protected readonly showForm = signal(false);

  protected readonly countries = ['Argentina', 'Brazil', 'Paraguay'];
  protected form: TourForm = this.emptyForm();

  constructor() {
    this.loadTours();
  }

  protected loadTours(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.http
      .get<Tour[]>(`${this.apiUrl}/findAll/active`)
      .pipe(
        catchError(() => {
          this.hasError.set(true);
          return of(this.tours());
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((tours) => this.tours.set(tours));
  }

  protected openCreateForm(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formError.set('');
    this.feedback.set('');
    this.showForm.set(true);
  }

  protected openEditForm(tour: Tour): void {
    this.editingId.set(tour.id);
    this.form = {
      price: tour.price,
      countryTour: tour.countryTour,
      kmOftour: tour.kmOftour,
      nameOfTour: tour.nameOfTour,
      locations: tour.locations,
    };
    this.formError.set('');
    this.feedback.set('');
    this.showForm.set(true);
  }

  protected closeForm(): void {
    if (!this.saving()) {
      this.showForm.set(false);
    }
  }

  protected saveTour(): void {
    const validationError = this.validateForm();
    if (validationError) {
      this.formError.set(validationError);
      return;
    }

    this.saving.set(true);
    this.formError.set('');
    this.feedback.set('');
    const id = this.editingId();
    const request = id === null
      ? this.http.post(`${this.apiUrl}/save`, this.form, { responseType: 'text' })
      : this.http.post(`${this.apiUrl}/update/${id}`, this.form, { responseType: 'text' });

    request
      .pipe(
        catchError(() => {
          this.formError.set('Não foi possível salvar o tour. Verifique os dados e tente novamente.');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((response) => {
        if (response === null) {
          return;
        }
        this.showForm.set(false);
        this.feedback.set(id === null ? 'Tour cadastrado com sucesso.' : 'Tour atualizado com sucesso.');
        this.loadTours();
      });
  }

  protected deactivateTour(tour: Tour): void {
    if (!confirm(`Desativar o tour "${tour.nameOfTour}"?`)) {
      return;
    }

    this.http
      .delete(`${this.apiUrl}/delete/${tour.id}`, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.hasError.set(true);
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response !== null) {
          this.feedback.set('Tour desativado com sucesso.');
          this.loadTours();
        }
      });
  }

  private validateForm(): string {
    if (!this.form.nameOfTour.trim() || !this.form.locations.trim() || !this.form.countryTour) {
      return 'Preencha o nome, o país e os locais do tour.';
    }
    if (this.form.price === null || this.form.price < 0 || this.form.kmOftour === null || this.form.kmOftour < 0) {
      return 'Preço e distância devem ser valores iguais ou maiores que zero.';
    }
    return '';
  }

  private emptyForm(): TourForm {
    return { price: null, countryTour: '', kmOftour: null, nameOfTour: '', locations: '' };
  }
}