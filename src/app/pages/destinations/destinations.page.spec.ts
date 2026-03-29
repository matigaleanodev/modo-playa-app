import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  Destination,
  DestinationContext,
} from 'src/app/destinations/models/destination.model';
import { DestinationsService } from 'src/app/destinations/services/destinations.service';
import { DestinationsPage } from './destinations.page';

describe('DestinationsPage', () => {
  let component: DestinationsPage;
  let fixture: ComponentFixture<DestinationsPage>;
  let destinationsService: jasmine.SpyObj<DestinationsService>;

  const destinationsMock: Destination[] = [
    { id: 'gesell', name: 'Villa Gesell' },
    { id: 'pampas', name: 'Mar de las Pampas' },
  ];

  const contextGesellMock: DestinationContext = {
    destinationId: 'gesell',
    destination: 'Villa Gesell',
    timezone: 'America/Argentina/Buenos_Aires',
    weather: {
      temperature: 24,
      windSpeed: 12,
      weatherCode: 1,
    },
    forecast: [
      { day: 'today', max: 26, min: 18 },
      { day: 'tomorrow', max: 25, min: 17 },
    ],
    sun: {
      sunrise: '06:11',
      sunset: '20:04',
    },
    pointsOfInterest: [],
  };

  const contextPampasMock: DestinationContext = {
    destinationId: 'pampas',
    destination: 'Mar de las Pampas',
    timezone: 'America/Argentina/Buenos_Aires',
    weather: {
      temperature: 27,
      windSpeed: 14,
      weatherCode: 3,
    },
    forecast: [
      { day: 'today', max: 28, min: 19 },
      { day: 'tomorrow', max: 27, min: 18 },
    ],
    sun: {
      sunrise: '06:12',
      sunset: '20:05',
    },
    pointsOfInterest: [],
  };

  const contextWithPointsMock: DestinationContext = {
    ...contextPampasMock,
    pointsOfInterest: [
      {
        id: 'downtown',
        title: 'Centro Comercial de Mar de las Pampas',
        category: 'downtown',
        summary: 'Nucleo comercial principal del destino.',
        googleMapsUrl: 'https://maps.google.com/?q=Centro+Comercial+de+Mar+de+las+Pampas',
        highlight: 'Paseo y servicios',
        displayOrder: 1,
      },
    ],
  };

  beforeEach(async () => {
    destinationsService = jasmine.createSpyObj<DestinationsService>(
      'DestinationsService',
      ['getDestinations', 'getContextByDestinationId'],
    );

    destinationsService.getDestinations.and.returnValue(of(destinationsMock));
    destinationsService.getContextByDestinationId.and.returnValue(
      of(contextGesellMock),
    );

    await TestBed.configureTestingModule({
      imports: [DestinationsPage],
      providers: [
        provideRouter([]),
        { provide: DestinationsService, useValue: destinationsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar destinos y contexto inicial al entrar', async () => {
    await component.ionViewWillEnter();

    expect(destinationsService.getDestinations).toHaveBeenCalledTimes(1);
    expect(destinationsService.getContextByDestinationId).toHaveBeenCalledWith(
      'gesell',
    );
    expect(component.destinations()).toEqual(destinationsMock);
    expect(component.selectedDestinationId()).toBe('gesell');
    expect(component.context()).toEqual(contextGesellMock);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('deberia recargar destinos al hacer pull to refresh', async () => {
    const completeSpy = jasmine.createSpy('complete').and.resolveTo(undefined);

    await component.onRefresh({
      target: { complete: completeSpy },
    } as never);

    expect(destinationsService.getDestinations).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('deberia mantener seleccion actual si el destino sigue disponible', async () => {
    component.selectedDestinationId.set('pampas');
    destinationsService.getContextByDestinationId.and.returnValue(
      of(contextPampasMock),
    );

    await component.ionViewWillEnter();

    expect(destinationsService.getContextByDestinationId).toHaveBeenCalledWith(
      'pampas',
    );
    expect(component.selectedDestinationId()).toBe('pampas');
    expect(component.context()).toEqual(contextPampasMock);
  });

  it('deberia limpiar seleccion y contexto si no hay destinos', async () => {
    destinationsService.getDestinations.and.returnValue(of([]));

    await component.ionViewWillEnter();

    expect(component.destinations()).toEqual([]);
    expect(component.selectedDestinationId()).toBeNull();
    expect(component.context()).toBeNull();
    expect(destinationsService.getContextByDestinationId).not.toHaveBeenCalled();
  });

  it('deberia renderizar empty state cuando no hay destinos publicados', async () => {
    destinationsService.getDestinations.and.returnValue(of([]));

    await component.ionViewWillEnter();
    fixture.detectChanges();

    const stateCard = fixture.nativeElement.querySelector('app-public-state-card');

    expect(stateCard?.textContent).toContain('Sin destinos disponibles');
  });

  it('deberia setear error si falla la carga de destinos', async () => {
    destinationsService.getDestinations.and.returnValue(
      throwError(() => new Error('network')),
    );

    await component.ionViewWillEnter();

    expect(component.error()).toBe(
      'No pudimos cargar los destinos. Intenta nuevamente.',
    );
    expect(component.loading()).toBeFalse();
  });

  it('deberia usar mensaje especifico si el backend invalida el destino', async () => {
    component.selectedDestinationId.set('gesell');
    destinationsService.getContextByDestinationId.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { code: 'INVALID_DESTINATION_ID' },
          }),
      ),
    );

    await component.retry();

    expect(component.error()).toBe(
      'El destino seleccionado ya no es válido. Elige otro para continuar.',
    );
    expect(component.context()).toBeNull();
  });

  it('deberia actualizar destino y contexto al cambiar el selector', async () => {
    destinationsService.getContextByDestinationId.and.returnValue(
      of(contextPampasMock),
    );

    await component.onDestinationChange({
      detail: { value: 'pampas' },
    } as unknown as never);

    expect(component.selectedDestinationId()).toBe('pampas');
    expect(destinationsService.getContextByDestinationId).toHaveBeenCalledWith(
      'pampas',
    );
    expect(component.context()).toEqual(contextPampasMock);
    expect(component.error()).toBeNull();
  });

  it('deberia ignorar cambios con valor no string', async () => {
    await component.onDestinationChange({
      detail: { value: 123 },
    } as unknown as never);

    expect(destinationsService.getContextByDestinationId).not.toHaveBeenCalled();
  });

  it('deberia setear error y limpiar contexto si falla la carga de contexto', async () => {
    component.selectedDestinationId.set('gesell');
    component.context.set(contextGesellMock);
    destinationsService.getContextByDestinationId.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 0 })),
    );

    await component.retry();

    expect(component.error()).toBe(
      'No pudimos cargar el contexto del destino por un problema de conexión.',
    );
    expect(component.context()).toBeNull();
    expect(component.loading()).toBeFalse();
  });

  it('retry deberia recargar destinos cuando no hay destinos en memoria', async () => {
    component.destinations.set([]);

    await component.retry();

    expect(destinationsService.getDestinations).toHaveBeenCalled();
  });

  it('retry deberia recargar contexto cuando ya hay destinos', async () => {
    component.destinations.set(destinationsMock);
    component.selectedDestinationId.set('gesell');

    await component.retry();

    expect(destinationsService.getContextByDestinationId).toHaveBeenCalledWith(
      'gesell',
    );
  });

  it('deberia calcular pronostico de hoy y manana', async () => {
    await component.ionViewWillEnter();

    expect(component.todayForecast()).toEqual(contextGesellMock.forecast[0]);
    expect(component.tomorrowForecast()).toEqual(contextGesellMock.forecast[1]);
    expect(component.destinationTimeLabel()).not.toBeNull();
  });

  it('deberia calcular etiqueta, icono y fondo para clima soleado de dia', async () => {
    const sunnyContext: DestinationContext = {
      ...contextGesellMock,
      weather: {
        ...contextGesellMock.weather,
        weatherCode: 0,
      },
      sun: {
        sunrise: '00:00',
        sunset: '23:59',
      },
    };
    destinationsService.getContextByDestinationId.and.returnValue(of(sunnyContext));

    await component.ionViewWillEnter();

    expect(component.weatherLabel()).toBe('Cielo despejado');
    expect(component.weatherIcon()).toBe('sunny-outline');
    expect(component.backgroundClass()).toBe('weather-bg-sunny');
  });

  it('deberia renderizar puntos de interes con link a google maps', async () => {
    destinationsService.getContextByDestinationId.and.returnValue(
      of(contextWithPointsMock),
    );

    await component.ionViewWillEnter();
    fixture.detectChanges();

    const hero = fixture.nativeElement.querySelector('.destinations-copy');
    const pointLink = fixture.nativeElement.querySelector('.point-item');

    expect(hero?.textContent).toContain('puntos clave');
    expect(pointLink?.getAttribute('href')).toBe(
      contextWithPointsMock.pointsOfInterest[0].googleMapsUrl,
    );
    expect(pointLink?.textContent).toContain('Ver mapa');
  });

  it('deberia mapear iconos de puntos de interes por categoria', () => {
    expect(component.getPointOfInterestIcon('healthcare')).toBe('medical-outline');
    expect(component.getPointOfInterestIcon('landmark')).toBe('location-outline');
  });
});
