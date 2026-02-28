import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InfoPage } from './info.page';

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería contener accesos a términos y privacidad', () => {
    const links = fixture.nativeElement.querySelectorAll('ion-item[routerlink]');
    const values = Array.from(links).map(
      (item) => (item as HTMLElement).getAttribute('routerlink') ?? '',
    );

    expect(values).toContain('/terms');
    expect(values).toContain('/privacy');
  });
});
