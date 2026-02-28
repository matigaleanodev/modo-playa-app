import { ActionSheetController } from '@ionic/angular/standalone';

export interface ActionSheetControllerMockContext {
  controller: jasmine.SpyObj<ActionSheetController>;
  overlay: jasmine.SpyObj<HTMLIonActionSheetElement>;
}

export function createActionSheetControllerMock(): ActionSheetControllerMockContext {
  const overlay = jasmine.createSpyObj<HTMLIonActionSheetElement>(
    'HTMLIonActionSheetElement',
    ['present'],
  );
  overlay.present.and.resolveTo();

  const controller = jasmine.createSpyObj<ActionSheetController>(
    'ActionSheetController',
    ['create'],
  );
  controller.create.and.resolveTo(overlay);

  return { controller, overlay };
}
