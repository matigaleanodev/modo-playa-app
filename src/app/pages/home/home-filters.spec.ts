import {
  ActiveFilterChip,
  applyDistanceRange,
  applyPriceRange,
  createDefaultHomeFilters,
  filterLodgings,
  getActiveFilters,
  getDistanceBounds,
  getPriceBounds,
  getSearchMatchedLodgings,
  setAvailabilityDate,
  setCityFilter,
  setMinBathrooms,
  setMinBedrooms,
  setTypeFilter,
  removeFilter,
  toggleAmenity,
} from './home-filters';
import {
  Lodging,
  LodgingAmenity,
  LodgingType,
  PriceUnit,
} from 'src/app/lodgings/models/lodging.model';

describe('home-filters', () => {
  const lodgings: Lodging[] = [
    {
      id: 'lodging-1',
      title: 'Cabaña Sur',
      description: 'Descripcion',
      location: 'Paseo 110',
      city: 'Villa Gesell',
      type: LodgingType.CABIN,
      price: 100000,
      priceUnit: PriceUnit.NIGHT,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      minNights: 2,
      distanceToBeach: 250,
      amenities: [LodgingAmenity.WIFI, LodgingAmenity.POOL],
      mainImage: 'https://example.com/lodging-1/default-hero.webp',
      images: ['https://example.com/lodging-1/default-original.webp'],
      occupiedRanges: [{ from: '2026-03-20', to: '2026-03-25' }],
    },
    {
      id: 'lodging-2',
      title: 'Refugio Norte',
      description: 'Descripcion',
      location: 'Avenida Costanera',
      city: 'Mar Azul',
      type: LodgingType.HOUSE,
      price: 150000,
      priceUnit: PriceUnit.NIGHT,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      minNights: 3,
      distanceToBeach: 600,
      amenities: [LodgingAmenity.WIFI],
      mainImage: 'https://example.com/lodging-2/default-hero.webp',
      images: ['https://example.com/lodging-2/default-original.webp'],
    },
  ];

  it('resuelve busquedas ignorando acentos y mayusculas', () => {
    expect(getSearchMatchedLodgings(lodgings, 'cabana')).toEqual([lodgings[0]]);
    expect(getSearchMatchedLodgings(lodgings, 'MAR AZUL')).toEqual([lodgings[1]]);
  });

  it('combina filtros de amenidades, precio y huespedes', () => {
    const filteredLodgings = filterLodgings(lodgings, {
      city: null,
      type: null,
      amenities: [LodgingAmenity.POOL],
      minPrice: 90000,
      maxPrice: 120000,
      minBedrooms: null,
      minBathrooms: null,
      minDistanceToBeach: null,
      maxDistanceToBeach: null,
      guests: 4,
      availableFrom: null,
      availableTo: null,
    });

    expect(filteredLodgings).toEqual([lodgings[0]]);
  });

  it('filtra por ciudad, tipo, dormitorios, baños y distancia', () => {
    const filters = applyDistanceRange(
      setMinBathrooms(
        setMinBedrooms(
          setTypeFilter(
            setCityFilter(createDefaultHomeFilters(), 'Mar Azul'),
            LodgingType.HOUSE,
          ),
          3,
        ),
        2,
      ),
      { lower: 0, upper: 650 },
      getDistanceBounds(lodgings),
    );

    expect(filterLodgings(lodgings, filters)).toEqual([lodgings[1]]);
  });

  it('filtra fechas libres usando occupiedRanges como criterio local', () => {
    const filters = setAvailabilityDate(
      setAvailabilityDate(createDefaultHomeFilters(), 'availableFrom', '2026-03-21'),
      'availableTo',
      '2026-03-23',
    );

    expect(filterLodgings(lodgings, filters)).toEqual([lodgings[1]]);
  });

  it('convierte el rango de precio en filtros nulos cuando coincide con los limites', () => {
    const bounds = getPriceBounds(lodgings);
    const filters = applyPriceRange(
      createDefaultHomeFilters(),
      {
        lower: bounds.min,
        upper: bounds.max,
      },
      bounds,
    );

    expect(filters.minPrice).toBeNull();
    expect(filters.maxPrice).toBeNull();
  });

  it('genera chips activos legibles para la UI', () => {
    const bounds = getPriceBounds(lodgings);
    const chips = getActiveFilters(
      {
        amenities: [LodgingAmenity.WIFI],
        city: 'Mar Azul',
        type: LodgingType.HOUSE,
        minPrice: 100000,
        maxPrice: 150000,
        minBedrooms: 2,
        minBathrooms: 1,
        minDistanceToBeach: null,
        maxDistanceToBeach: 700,
        guests: 2,
        availableFrom: '2026-03-26',
        availableTo: '2026-03-28',
      },
      bounds,
      getDistanceBounds(lodgings),
    );

    expect(chips[0]).toEqual({
      kind: 'amenity',
      amenity: LodgingAmenity.WIFI,
      label: 'WiFi',
    });
    expect(chips.some((chip) => chip.kind === 'city' && chip.label === 'Mar Azul')).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'type' && chip.label === 'Casa'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'price' && chip.label.replace(/\s/g, '') === '$100.000-$150.000'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'bedrooms' && chip.label === '2+ dorm.'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'bathrooms' && chip.label === '1+ baño'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'distance' && chip.label === 'Hasta 700 m'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'guests' && chip.label === '2 huéspedes'),
    ).toBeTrue();
    expect(
      chips.some((chip) => chip.kind === 'availability' && chip.label === '26/03/2026-28/03/2026'),
    ).toBeTrue();
  });

  it('remueve un chip de amenidad sin tocar el resto de filtros', () => {
    const filters = toggleAmenity(createDefaultHomeFilters(), LodgingAmenity.WIFI);
    const chip = {
      kind: 'amenity',
      amenity: LodgingAmenity.WIFI,
      label: 'WiFi',
    } satisfies ActiveFilterChip;

    expect(removeFilter(filters, chip)).toEqual(createDefaultHomeFilters());
  });
});
