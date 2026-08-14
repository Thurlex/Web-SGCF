import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.html',
  styleUrl: './tours.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tours {}