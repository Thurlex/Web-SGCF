import { ChangeDetectionStrategy, Component, ElementRef, effect, input, viewChild } from '@angular/core';
import { createElement, type IconNode } from 'lucide';

@Component({
  selector: 'app-icon',
  template: '<span #container aria-hidden="true"></span>',
  styles: `
    :host,
    span {
      display: inline-flex;
      width: 1.25rem;
      height: 1.25rem;
    }

    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  readonly icon = input.required<IconNode>();
  private readonly container = viewChild.required<ElementRef<HTMLSpanElement>>('container');

  constructor() {
    effect(() => {
      const container = this.container().nativeElement;
      container.replaceChildren(createElement(this.icon(), { 'stroke-width': 1.8 }));
    });
  }
}