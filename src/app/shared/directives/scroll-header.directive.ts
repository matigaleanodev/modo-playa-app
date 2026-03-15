import {
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Directive({
  selector: 'ion-content[appScrollHeader]',
  standalone: true,
})
export class ScrollHeaderDirective {
  private readonly ionContent = inject(IonContent);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly threshold = 18;
  private header: HTMLElement | null = null;

  constructor() {
    this.ionContent.scrollEvents = true;
    this.header = this.resolveHeader();
  }

  @HostListener('ionScroll', ['$event'])
  onScroll(event: CustomEvent<{ scrollTop: number }>): void {
    if (!this.header) {
      this.header = this.resolveHeader();
    }

    this.header?.classList.toggle(
      'is-scrolled',
      (event.detail?.scrollTop ?? 0) > this.threshold,
    );
  }

  private resolveHeader(): HTMLElement | null {
    const host = this.elementRef.nativeElement;
    let sibling = host.previousElementSibling;

    while (sibling) {
      if (sibling instanceof HTMLElement && sibling.tagName === 'ION-HEADER') {
        return sibling;
      }

      sibling = sibling.previousElementSibling;
    }

    return host.parentElement?.querySelector(':scope > ion-header') ?? null;
  }
}
