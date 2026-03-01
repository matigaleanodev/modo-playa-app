import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavService } from '@shared/services/nav/nav.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const navServiceMock = {
    forward: jasmine.createSpy('forward'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: NavService,
          useValue: navServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    navServiceMock.forward.calls.reset();
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar cards de alojamientos', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-lodging-card');
    expect(cards.length).toBe(component.lodgings.length);
  });

  it('deberia navegar al detalle del alojamiento', () => {
    component.toLodgingDetail(component.lodgings[0]);

    expect(navServiceMock.forward).toHaveBeenCalledWith(
      `/lodging/${component.lodgings[0].id}`,
    );
  });
});
