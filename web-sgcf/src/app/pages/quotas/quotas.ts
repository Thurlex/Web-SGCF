import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-quotas',
  templateUrl: './quotas.html',
  styleUrl: './quotas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Quotas {}