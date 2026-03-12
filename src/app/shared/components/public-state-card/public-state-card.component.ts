import { Component, input, output } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, searchOutline } from 'ionicons/icons';

type PublicStateKind = 'loading' | 'empty' | 'error';

@Component({
  selector: 'app-public-state-card',
  template: `
    <section
      class="public-state-card"
      [class.is-error]="kind() === 'error'"
      [class.is-loading]="kind() === 'loading'"
      [attr.role]="kind() === 'error' ? 'alert' : 'status'"
      [attr.aria-live]="kind() === 'error' ? 'assertive' : 'polite'"
    >
      <div class="public-state-card__icon" aria-hidden="true">
        @if (kind() === 'loading') {
          <ion-spinner name="crescent"></ion-spinner>
        } @else if (kind() === 'error') {
          <ion-icon name="alert-circle-outline"></ion-icon>
        } @else {
          <ion-icon name="search-outline"></ion-icon>
        }
      </div>

      <div class="public-state-card__copy">
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
      </div>

      @if (actionLabel()) {
        <ion-button size="small" fill="outline" (click)="action.emit()">
          {{ actionLabel() }}
        </ion-button>
      }
    </section>
  `,
  styles: [
    `
      .public-state-card {
        display: grid;
        justify-items: center;
        gap: 10px;
        padding: 18px 16px;
        border-radius: 20px;
        text-align: center;
        background: color-mix(in srgb, var(--ion-color-light) 30%, white 70%);
        border: 1px solid color-mix(in srgb, var(--ion-color-secondary) 10%, transparent);
        backdrop-filter: blur(6px);
      }

      .public-state-card.is-loading {
        background: color-mix(in srgb, var(--ion-color-light) 24%, white 76%);
      }

      .public-state-card.is-error {
        color: var(--ion-color-danger);
        border-color: color-mix(in srgb, var(--ion-color-danger) 26%, transparent);
      }

      .public-state-card__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--ion-color-primary) 12%, white 88%);
        color: var(--ion-color-secondary);
      }

      .public-state-card.is-error .public-state-card__icon {
        background: color-mix(in srgb, var(--ion-color-danger) 12%, white 88%);
        color: var(--ion-color-danger);
      }

      .public-state-card__icon ion-icon {
        font-size: 1.4rem;
      }

      .public-state-card__copy {
        display: grid;
        gap: 4px;
      }

      .public-state-card__copy h2,
      .public-state-card__copy p {
        margin: 0;
      }

      .public-state-card__copy h2 {
        font-size: 1.05rem;
      }

      .public-state-card__copy p {
        color: color-mix(in srgb, var(--ion-text-color) 82%, white 18%);
      }

      .public-state-card.is-error .public-state-card__copy p {
        color: currentColor;
      }

      :host-context(.ion-palette-dark) .public-state-card {
        background: rgba(12, 28, 43, 0.78);
        border-color: rgba(147, 187, 218, 0.18);
      }

      :host-context(.ion-palette-dark) .public-state-card__icon {
        background: rgba(38, 82, 118, 0.28);
        color: rgba(220, 233, 245, 0.96);
      }

      :host-context(.ion-palette-dark) .public-state-card__copy p {
        color: rgba(209, 222, 235, 0.9);
      }

      :host-context(.ion-palette-dark) .public-state-card.is-error {
        border-color: rgba(194, 103, 113, 0.42);
      }
    `,
  ],
  imports: [IonButton, IonIcon, IonSpinner],
})
export class PublicStateCardComponent {
  readonly kind = input<PublicStateKind>('empty');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input<string | null>(null);
  readonly action = output<void>();

  constructor() {
    addIcons({
      alertCircleOutline,
      searchOutline,
    });
  }
}
