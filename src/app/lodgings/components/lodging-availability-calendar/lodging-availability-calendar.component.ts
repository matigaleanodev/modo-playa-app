import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { AvailabilityRange } from '../../models/lodging.model';
import {
  CalendarCell,
  CalendarDayState,
  NormalizedAvailabilityRange,
} from './lodging-availability-calendar.types';

@Component({
  selector: 'app-lodging-availability-calendar',
  standalone: true,
  templateUrl: './lodging-availability-calendar.component.html',
  styleUrl: './lodging-availability-calendar.component.scss',
  imports: [CommonModule, IonButton, IonIcon],
})
export class LodgingAvailabilityCalendarComponent {
  private readonly monthLabelFormatter = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  });

  readonly occupiedRanges = input<AvailabilityRange[] | null | undefined>([]);
  readonly title = input<string | null>('Disponibilidad');
  readonly selectionEnabled = input(false);
  readonly selectedFrom = input<string | null>(null);
  readonly selectedTo = input<string | null>(null);
  readonly rangeChange = output<AvailabilityRange | null>();
  readonly weekdayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  readonly currentMonth = signal(this.startOfMonth(new Date()));

  readonly monthLabel = computed(() => {
    const parts = this.monthLabelFormatter.formatToParts(this.currentMonth());
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const year = parts.find((part) => part.type === 'year')?.value ?? '';
    const normalizedMonth =
      month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

    return `${normalizedMonth} ${year}`.trim();
  });

  readonly normalizedRanges = computed<NormalizedAvailabilityRange[]>(() =>
    (this.occupiedRanges() ?? [])
      .map((range) => this.normalizeRange(range))
      .filter(
        (range): range is NormalizedAvailabilityRange => range !== null,
      )
      .sort((left, right) => left.from.localeCompare(right.from)),
  );

  readonly calendarCells = computed<CalendarCell[]>(() => {
    const monthStart = this.currentMonth();
    const totalDays = this.daysInMonth(monthStart);
    const startOffset = this.getSundayBasedWeekday(monthStart);
    const todayKey = this.toDateKey(new Date());
    const ranges = this.normalizedRanges();
    const cells: CalendarCell[] = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push({
        id: `placeholder-${monthStart.getFullYear()}-${monthStart.getMonth()}-${index}`,
        isPlaceholder: true,
      });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = this.createLocalDate(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        day,
      );
      const isoDate = this.toDateKey(date);
      const range = this.findRangeForDate(isoDate, ranges);
      const isPast = isoDate < todayKey;
      const state: CalendarDayState = isPast
        ? 'past'
        : range
          ? 'occupied'
          : 'available';
      const classes = [`calendar-day--${state}`];
      const isSelected = this.isWithinSelectedRange(isoDate);
      const selectedFrom = this.selectedFrom();
      const selectedTo = this.selectedTo() ?? selectedFrom;

      if (state === 'occupied' && range) {
        if (isoDate === range.from) {
          classes.push('calendar-day--range-start');
        }

        if (isoDate > range.from && isoDate < range.to) {
          classes.push('calendar-day--range-middle');
        }

        if (isoDate === range.to) {
          classes.push('calendar-day--range-end');
        }
      }

      if (isSelected) {
        classes.push('calendar-day--selected');

        if (selectedFrom && isoDate === selectedFrom) {
          classes.push('calendar-day--range-start');
        }

        if (selectedFrom && selectedTo && isoDate > selectedFrom && isoDate < selectedTo) {
          classes.push('calendar-day--range-middle');
        }

        if (selectedTo && isoDate === selectedTo) {
          classes.push('calendar-day--range-end');
        }
      }

      cells.push({
        id: isoDate,
        isPlaceholder: false,
        dayNumber: day,
        isoDate,
        state,
        classes,
        ariaLabel: this.buildAriaLabel(day, state, isoDate),
        isInteractive: this.selectionEnabled() && state === 'available',
      });
    }

    return cells;
  });

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

  showPreviousMonth(): void {
    const month = this.currentMonth();
    this.currentMonth.set(
      this.createLocalDate(month.getFullYear(), month.getMonth() - 1, 1),
    );
  }

  showNextMonth(): void {
    const month = this.currentMonth();
    this.currentMonth.set(
      this.createLocalDate(month.getFullYear(), month.getMonth() + 1, 1),
    );
  }

  selectDay(isoDate: string): void {
    if (!this.selectionEnabled()) {
      return;
    }

    const start = this.selectedFrom();
    const end = this.selectedTo();

    if (!start || (start && end)) {
      this.rangeChange.emit({ from: isoDate, to: isoDate });
      return;
    }

    if (isoDate < start) {
      this.rangeChange.emit({ from: isoDate, to: isoDate });
      return;
    }

    this.rangeChange.emit({ from: start, to: isoDate });
  }

  private normalizeRange(
    range: AvailabilityRange | null | undefined,
  ): NormalizedAvailabilityRange | null {
    if (!range?.from || !range?.to) {
      return null;
    }

    const from = range.from.trim();
    const to = range.to.trim();

    if (!this.isIsoDate(from) || !this.isIsoDate(to) || from > to) {
      return null;
    }

    return { from, to };
  }

  private findRangeForDate(
    isoDate: string,
    ranges: NormalizedAvailabilityRange[],
  ): NormalizedAvailabilityRange | undefined {
    for (const range of ranges) {
      if (isoDate >= range.from && isoDate <= range.to) {
        return range;
      }
    }

    return undefined;
  }

  private buildAriaLabel(
    dayNumber: number,
    state: CalendarDayState,
    isoDate: string,
  ): string {
    const stateLabels: Record<CalendarDayState, string> = {
      available: 'disponible',
      occupied: 'ocupado',
      past: 'pasado',
    };

    return `${dayNumber}, ${isoDate}, ${stateLabels[state]}`;
  }

  private daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  private getSundayBasedWeekday(date: Date): number {
    return date.getDay();
  }

  private createLocalDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day, 12, 0, 0, 0);
  }

  private startOfMonth(date: Date): Date {
    return this.createLocalDate(date.getFullYear(), date.getMonth(), 1);
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private isIsoDate(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private isWithinSelectedRange(isoDate: string): boolean {
    const from = this.selectedFrom();

    if (!from) {
      return false;
    }

    const to = this.selectedTo() ?? from;
    return isoDate >= from && isoDate <= to;
  }
}
