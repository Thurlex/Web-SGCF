import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-reservation-status',
  templateUrl: './edit-reservation-status.html',
  styleUrl: './edit-reservation-status.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationStatus {}