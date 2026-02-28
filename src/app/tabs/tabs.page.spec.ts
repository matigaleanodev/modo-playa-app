import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActionSheetController } from '@ionic/angular/standalone';
import { createActionSheetControllerMock } from '@shared/mocks/ui/action-sheet-controller.mock';
import { ThemeMode, ThemeService } from '@shared/services/theme/theme.service';
import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  const actionSheetMock = createActionSheetControllerMock();

  const themeServiceMock: Pick<ThemeService, 'currentTheme' | 'setTheme'> = {
    currentTheme: signal<ThemeMode>('system'),
    setTheme: jasmine.createSpy('setTheme'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [
        provideRouter([]),
        { provide: ActionSheetController, useValue: actionSheetMock.controller },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    expect(component.tabItems.length).toBeGreaterThan(0);
  });

  it('debería resolver la etiqueta de tema', () => {
    themeServiceMock.currentTheme.set('light');
    expect(component.currentThemeLabel()).toBe('Claro');

    themeServiceMock.currentTheme.set('dark');
    expect(component.currentThemeLabel()).toBe('Oscuro');

    themeServiceMock.currentTheme.set('system');
    expect(component.currentThemeLabel()).toBe('Sistema');
  });

  it('debería abrir selector de tema desde acción de menú', async () => {
    await component.onMenuAction('theme');

    expect(actionSheetMock.controller.create).toHaveBeenCalled();
    expect(actionSheetMock.overlay.present).toHaveBeenCalled();
  });

  it('debería ejecutar handler de tema oscuro desde action sheet', async () => {
    await component.onMenuAction('theme');

    const config = actionSheetMock.controller.create.calls.mostRecent().args[0] as {
      buttons: Array<{ text: string; handler?: () => void }>;
    };

    const darkButton = config.buttons.find((button) => button.text === 'Oscuro');
    expect(darkButton).toBeDefined();

    darkButton?.handler?.();
    expect(themeServiceMock.setTheme).toHaveBeenCalledWith('dark');
  });
});
