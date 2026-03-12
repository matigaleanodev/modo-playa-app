import { DestinationSun } from '../models/destination.model';

export function formatDestinationTime(
  timezone: string,
  now = new Date(),
): string | null {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now);
  } catch {
    return null;
  }
}

export function isNightInDestination(
  sun: DestinationSun | undefined,
  timezone: string | undefined,
  now = new Date(),
): boolean {
  if (!sun || !timezone) {
    return false;
  }

  const nowMinutes = getMinutesInTimezone(timezone, now);
  const sunriseMinutes = parseTimeToMinutes(sun.sunrise);
  const sunsetMinutes = parseTimeToMinutes(sun.sunset);

  if (
    nowMinutes === null ||
    sunriseMinutes === null ||
    sunsetMinutes === null
  ) {
    return false;
  }

  return nowMinutes < sunriseMinutes || nowMinutes >= sunsetMinutes;
}

function getMinutesInTimezone(timezone: string, now: Date): number | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    }

    return hour * 60 + minute;
  } catch {
    return null;
  }
}

function parseTimeToMinutes(time: string): number | null {
  const [hours, minutes] = time.split(':').map((value) => Number(value));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}
