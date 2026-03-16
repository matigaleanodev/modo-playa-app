import {
  formatDestinationTime,
  isNightInDestination,
} from './destination-time';

describe('destination-time', () => {
  const buenosAiresTimezone = 'America/Argentina/Buenos_Aires';

  it('formatea hora local del destino usando la timezone del backend', () => {
    const localTime = formatDestinationTime(
      buenosAiresTimezone,
      new Date('2026-03-12T21:30:00.000Z'),
    );

    expect(localTime).toBe('18:30');
  });

  it('detecta noche segun hora local del destino y no segun hora del dispositivo', () => {
    const isNight = isNightInDestination(
      {
        sunrise: '06:15',
        sunset: '20:00',
      },
      buenosAiresTimezone,
      new Date('2026-03-12T00:30:00.000Z'),
    );

    expect(isNight).toBeTrue();
  });

  it('devuelve false si la timezone es invalida', () => {
    const isNight = isNightInDestination(
      {
        sunrise: '06:15',
        sunset: '20:00',
      },
      'Invalid/Timezone',
      new Date('2026-03-12T12:00:00.000Z'),
    );

    expect(isNight).toBeFalse();
  });
});
