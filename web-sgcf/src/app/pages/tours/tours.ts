import { CurrencyPipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { catchError, finalize, of } from 'rxjs';
import Swal from 'sweetalert2';

import { Tour, TourForm } from '../../models/tour';
import { TourService } from '../../service/tour.service';

@Component({
  selector: 'app-tours',
  imports: [CurrencyPipe, FormsModule, MdbFormsModule, MdbModalModule],
  templateUrl: './tours.html',
  styleUrl: './tours.scss',
})
export class Tours {
  private readonly tourService = inject(TourService);
  private readonly modalService = inject(MdbModalService);

  @ViewChild('modalTour') modalTour!: TemplateRef<any>;

  modalRef!: MdbModalRef<any>;

  protected readonly tours = signal<Tour[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly hasError = signal(false);
  protected readonly formError = signal('');
  protected readonly editingId = signal<number | null>(null);

  protected readonly countries = ['Argentina', 'Brazil', 'Paraguay'];
  protected form: TourForm = this.emptyForm();

  constructor() {
    this.loadTours();
  }

  protected loadTours(): void {
    this.loading.set(true);
    this.hasError.set(false);

    this.tourService
      .findAllActive()
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
    this.modalRef = this.modalService.open(this.modalTour);
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
    this.modalRef = this.modalService.open(this.modalTour);
  }

  protected closeForm(): void {
    if (!this.saving()) {
      this.modalRef.close();
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
    const id = this.editingId();
    const request = id === null
      ? this.tourService.save(this.form)
      : this.tourService.update(id, this.form);

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
        this.modalRef.close();
        Swal.fire(id === null ? 'Tour cadastrado com sucesso.' : 'Tour atualizado com sucesso.');
        this.loadTours();
      });
  }

  protected deactivateTour(tour: Tour): void {
    Swal.fire({
      title: 'Desativar o tour ' + tour.nameOfTour + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, desativar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tourService
          .delete(tour.id)
          .pipe(
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          )
          .subscribe((response) => {
            if (response !== null) {
              Swal.fire('Tour desativado com sucesso.');
              this.loadTours();
            }
          });
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
