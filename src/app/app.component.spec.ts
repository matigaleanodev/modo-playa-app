import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActionSheetController } from '@ionic/angular/standalone';
import { createActionSheetControllerMock } from '@shared/mocks/ui/action-sheet-controller.mock';
import { ThemeMode, ThemeService } from '@shared/services/theme/theme.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const actionSheetMock = createActionSheetControllerMock();
  const themeServiceMock: Pick<ThemeService, 'currentTheme' | 'setTheme'> = {
    currentTheme: signal<ThemeMode>('system'),
    setTheme: jasmine.createSpy('setTheme'),
  };

  it('should create the app', async () => {
    TestBed.overrideComponent(AppComponent, {
      set: {
        template: `
          <ion-app>
            <div id="app-content"></div>
          </ion-app>
        `,
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: ActionSheetController, useValue: actionSheetMock.controller },
        { provide: ThemeService, useValue: themeServiceMock },
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
