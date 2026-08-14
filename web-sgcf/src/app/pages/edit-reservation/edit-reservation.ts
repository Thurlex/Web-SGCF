import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.html',
  styleUrl: './edit-reservation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservation {}