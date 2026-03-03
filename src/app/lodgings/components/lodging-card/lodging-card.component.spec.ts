import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LodgingCardComponent } from './lodging-card.component';
import { Lodging, LodgingType, PriceUnit } from '../../models/lodging.model';

describe('LodgingCardComponent', () => {
  let component: LodgingCardComponent;
  let fixture: ComponentFixture<LodgingCardComponent>;

  const lodgingMock: Lodging = {
    id: 'lodging-1',
    title: 'Cabana Sur',
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
    amenities: [],
    mainImage: '',
    images: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lodging', lodgingMock);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar datos del alojamiento', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Cabana Sur');
    expect(text).toContain('Villa Gesell');
  });

  it('deberia emitir lodgingDetail al invocar toLodgingDetail', () => {
    const emitSpy = spyOn(component.lodgingDetail, 'emit');
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.toLodgingDetail(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(lodgingMock);
  });

  it('deberia emitir favoriteToggled al invocar toggleFavorite', () => {
    const emitSpy = spyOn(component.favoriteToggled, 'emit');
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.toggleFavorite(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(lodgingMock);
  });

  it('deberia usar imagen fallback cuando mainImage esta vacia', () => {
    expect(component.imageUrl()).toBe(component.fallbackImage);
  });
});
