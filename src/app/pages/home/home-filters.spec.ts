import {
  ActiveFilterChip,
  applyPriceRange,
  createDefaultHomeFilters,
  filterLodgings,
  getActiveFilters,
  getPriceBounds,
  getSearchMatchedLodgings,
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
      amenities: [LodgingAmenity.WIFI, LodgingAmenity.POOL],
      mainImage: 'https://example.com/lodging-1/default-hero.webp',
      images: ['https://example.com/lodging-1/default-original.webp'],
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
      amenities: [LodgingAmenity.POOL],
      minPrice: 90000,
      maxPrice: 120000,
      guests: 4,
    });

    expect(filteredLodgings).toEqual([lodgings[0]]);
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
        minPrice: 100000,
        maxPrice: 150000,
        guests: 2,
      },
      bounds,
    );

    expect(chips[0]).toEqual({
      kind: 'amenity',
      amenity: LodgingAmenity.WIFI,
      label: 'WiFi',
    });
    expect(chips[1].kind).toBe('price');
    expect(chips[1].label.replace(/\s/g, '')).toBe('$100.000-$150.000');
    expect(chips[2]).toEqual({ kind: 'guests', label: '2 huéspedes' });
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
