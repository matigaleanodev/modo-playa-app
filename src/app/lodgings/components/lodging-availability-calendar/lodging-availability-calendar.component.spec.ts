import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LodgingAvailabilityCalendarComponent } from './lodging-availability-calendar.component';

describe('LodgingAvailabilityCalendarComponent', () => {
  let component: LodgingAvailabilityCalendarComponent;
  let fixture: ComponentFixture<LodgingAvailabilityCalendarComponent>;

  function isCalendarDayCell(
    cell: (typeof component.calendarCells extends () => infer T ? T : never)[number],
  ): cell is Extract<
    (typeof component.calendarCells extends () => infer T ? T : never)[number],
    { isPlaceholder: false }
  > {
    return !cell.isPlaceholder;
  }

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 2, 10, 12, 0, 0, 0));

    await TestBed.configureTestingModule({
      imports: [LodgingAvailabilityCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LodgingAvailabilityCalendarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('occupiedRanges', [
      { from: '2026-03-06', to: '2026-03-13' },
      { from: '2026-03-16', to: '2026-03-22' },
    ]);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia iniciar la semana en domingo y mostrar el mes actual sin "de"', () => {
    expect(component.weekdayLabels).toEqual(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
    expect(component.monthLabel()).toBe('Marzo 2026');

    const weekdayLabels = Array.from(
      fixture.nativeElement.querySelectorAll('.calendar-weekday'),
    ).map((element) => (element as Element).textContent?.trim() ?? '');

    expect(weekdayLabels).toEqual(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
  });

  it('deberia marcar dias pasados, ocupados y disponibles con sus clases', () => {
    const cells = component.calendarCells().filter(isCalendarDayCell);
    const dayNine = cells.find((cell) => cell.isoDate === '2026-03-09');
    const dayTen = cells.find((cell) => cell.isoDate === '2026-03-10');
    const dayTwelve = cells.find((cell) => cell.isoDate === '2026-03-12');
    const dayThirteen = cells.find((cell) => cell.isoDate === '2026-03-13');
    const dayFourteen = cells.find((cell) => cell.isoDate === '2026-03-14');

    expect(dayNine?.classes).toContain('calendar-day--past');
    expect(dayTen?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-middle',
    ]);
    expect(dayTwelve?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-middle',
    ]);
    expect(dayThirteen?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-end',
    ]);
    expect(dayFourteen?.classes).toEqual(['calendar-day--available']);
  });

  it('deberia mostrar una barra continua para rangos ocupados futuros', () => {
    const cells = component.calendarCells().filter(isCalendarDayCell);
    const daySixteen = cells.find((cell) => cell.isoDate === '2026-03-16');
    const daySeventeen = cells.find((cell) => cell.isoDate === '2026-03-17');
    const dayTwentyTwo = cells.find((cell) => cell.isoDate === '2026-03-22');

    expect(daySixteen?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-start',
    ]);
    expect(daySeventeen?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-middle',
    ]);
    expect(dayTwentyTwo?.classes).toEqual([
      'calendar-day--occupied',
      'calendar-day--range-end',
    ]);
  });

  it('deberia navegar entre meses', () => {
    component.showNextMonth();
    fixture.detectChanges();

    expect(component.monthLabel()).toBe('Abril 2026');

    component.showPreviousMonth();
    component.showPreviousMonth();
    fixture.detectChanges();

    expect(component.monthLabel()).toBe('Febrero 2026');
  });
});
