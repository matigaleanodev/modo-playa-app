import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Lodging } from '../../models/lodging.model';

@Component({
  selector: 'app-lodging-card',
  templateUrl: './lodging-card.component.html',
  styleUrls: ['./lodging-card.component.scss'],
  imports: [CurrencyPipe],
})
export class LodgingCardComponent {
  readonly lodging = input.required<Lodging>();
}
