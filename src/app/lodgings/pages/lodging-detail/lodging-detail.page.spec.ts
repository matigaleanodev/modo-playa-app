import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LodgingDetailPage } from './lodging-detail.page';
import { LodgingAvailabilityCalendarComponent } from '../../components/lodging-availability-calendar/lodging-availability-calendar.component';
import { LodgingsResourceService } from '../../services/lodgings-resource.service';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from '../../models/lodging.model';

describe('LodgingDetailPage', () => {
  let component: LodgingDetailPage;
  let fixture: ComponentFixture<LodgingDetailPage>;
  const lodgingsResourceMock = {
    isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
    loadFavorites: jasmine.createSpy('loadFavorites').and.resolveTo(undefined),
    toggleFavorite: jasmine.createSpy('toggleFavorite').and.resolveTo(undefined),
  };
  const lodgingMock: Lodging = {
    id: 'lodging-42',
    title: 'Casa de prueba',
    description: 'Descripcion de prueba',
    location: 'Calle 1',
    city: 'Villa Gesell',
    type: LodgingType.HOUSE,
    price: 120000,
    priceUnit: PriceUnit.NIGHT,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    minNights: 2,
    distanceToBeach: 200,
    amenities: [LodgingAmenity.WIFI, LodgingAmenity.POOL],
    mainImage: 'https://example.com/main.webp',
    images: ['https://example.com/1.webp', 'https://example.com/main.webp'],
    occupiedRanges: [{ from: '2026-03-10', to: '2026-03-13' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgingDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: LodgingsResourceService,
          useValue: lodgingsResourceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingDetailPage);
    component = fixture.componentInstance;
    lodgingsResourceMock.isFavorite.calls.reset();
    lodgingsResourceMock.loadFavorites.calls.reset();
    lodgingsResourceMock.toggleFavorite.calls.reset();
    fixture.componentRef.setInput('lodging', lodgingMock);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer imágenes secundarias en galería', () => {
    expect(component.galleryImages).toEqual(['https://example.com/1.webp']);
  });

  it('deberia cargar favoritos al entrar', async () => {
    await component.ionViewWillEnter();

    expect(lodgingsResourceMock.loadFavorites).toHaveBeenCalled();
  });

  it('deberia delegar toggleFavorite al recurso', async () => {
    await component.toggleFavorite();

    expect(lodgingsResourceMock.toggleFavorite).toHaveBeenCalledWith(
      lodgingMock,
    );
  });

  it('deberia consultar estado favorito para el alojamiento', () => {
    component.isFavorite();

    expect(lodgingsResourceMock.isFavorite).toHaveBeenCalledWith(lodgingMock.id);
  });

  it('deberia renderizar el calendario de disponibilidad', () => {
    const calendarDebugElement = fixture.debugElement.query(
      By.directive(LodgingAvailabilityCalendarComponent),
    );
    const calendarComponent =
      calendarDebugElement.componentInstance as LodgingAvailabilityCalendarComponent;

    expect(calendarDebugElement).not.toBeNull();
    expect(calendarComponent.occupiedRanges()).toEqual(
      lodgingMock.occupiedRanges ?? [],
    );
  });

  it('deberia mostrar la seccion de comodidades', () => {
    const headings = Array.from(
      fixture.nativeElement.querySelectorAll('h2'),
    ) as HTMLHeadingElement[];
    const heading = headings.find((element) =>
      element.textContent?.includes('Comodidades'),
    );

    expect(heading).toBeTruthy();
  });

  it('deberia priorizar mediaImages publicas para hero y galeria sin key legacy', () => {
    const lodgingWithPublicMedia: Lodging = {
      ...lodgingMock,
      mainImage: '',
      images: ['https://example.com/legacy-gallery.webp'],
      mediaImages: [
        {
          imageId: 'image-1',
          isDefault: true,
          createdAt: '2026-03-12T10:00:00.000Z',
          url: 'https://example.com/default.webp',
          variants: {
            thumb: 'https://example.com/default-thumb.webp',
            card: 'https://example.com/default-card.webp',
            hero: 'https://example.com/default-hero.webp',
          },
        },
        {
          imageId: 'image-2',
          isDefault: false,
          createdAt: '2026-03-12T10:05:00.000Z',
          url: 'https://example.com/gallery.webp',
          variants: {
            thumb: 'https://example.com/gallery-thumb.webp',
            card: 'https://example.com/gallery-card.webp',
            hero: 'https://example.com/gallery-hero.webp',
          },
        },
      ],
    };

    fixture.componentRef.setInput('lodging', lodgingWithPublicMedia);
    fixture.detectChanges();

    expect(component.heroImage).toBe('https://example.com/default-hero.webp');
    expect(component.galleryImages).toEqual([
      'https://example.com/gallery-hero.webp',
    ]);
  });
});
