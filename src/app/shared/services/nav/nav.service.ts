import { inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private readonly navController = inject(NavController);

  forward(path: string, queryParams?: Record<string, string | number | boolean>): void {
    void this.navController.navigateForward(path, {
      queryParams,
      animated: true,
      animationDirection: 'forward',
    });
  }

  back(): void {
    void this.navController.back();
  }

  root(path: string): void {
    void this.navController.navigateRoot(path, { replaceUrl: true });
  }

  search(query: string): void {
    const q = query.trim();
    if (!q) {
      return;
    }

    this.forward('/search', { q });
  }

  volverHome(): void {
    this.root('/home');
  }
}
