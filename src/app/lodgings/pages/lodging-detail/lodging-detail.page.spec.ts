import { convertToParamMap, provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LodgingDetailPage } from './lodging-detail.page';

describe('LodgingDetailPage', () => {
  let component: LodgingDetailPage;
  let fixture: ComponentFixture<LodgingDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgingDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'lodging-42' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería resolver el id de ruta', () => {
    expect(component.lodgingId).toBe('lodging-42');
  });
});
