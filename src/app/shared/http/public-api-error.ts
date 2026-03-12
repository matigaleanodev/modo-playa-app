import { HttpErrorResponse } from '@angular/common/http';

export const PUBLIC_API_ERROR_CODES = {
  REQUEST_VALIDATION_ERROR: 'REQUEST_VALIDATION_ERROR',
  INVALID_DESTINATION_ID: 'INVALID_DESTINATION_ID',
  INVALID_LODGING_ID: 'INVALID_LODGING_ID',
  INVALID_PRICE_RANGE: 'INVALID_PRICE_RANGE',
  LODGING_NOT_FOUND: 'LODGING_NOT_FOUND',
} as const;

export type PublicApiErrorCode =
  (typeof PUBLIC_API_ERROR_CODES)[keyof typeof PUBLIC_API_ERROR_CODES];

interface PublicApiErrorPayload {
  code?: string;
  message?: string;
}

function isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
  return error instanceof HttpErrorResponse;
}

function getErrorPayload(error: HttpErrorResponse): PublicApiErrorPayload | null {
  if (!error.error || typeof error.error !== 'object') {
    return null;
  }

  return error.error as PublicApiErrorPayload;
}

export function getPublicApiErrorCode(error: unknown): string | null {
  if (!isHttpErrorResponse(error)) {
    return null;
  }

  const payload = getErrorPayload(error);
  return typeof payload?.code === 'string' ? payload.code : null;
}

export function isNetworkError(error: unknown): boolean {
  return isHttpErrorResponse(error) && error.status === 0;
}

export function getHomeLodgingsErrorMessage(error: unknown): string {
  const code = getPublicApiErrorCode(error);

  if (code === PUBLIC_API_ERROR_CODES.INVALID_PRICE_RANGE) {
    return 'El rango de precios no es válido. Ajusta los filtros e intenta nuevamente.';
  }

  if (code === PUBLIC_API_ERROR_CODES.REQUEST_VALIDATION_ERROR) {
    return 'Algunos filtros no son válidos. Revísalos e intenta nuevamente.';
  }

  if (isNetworkError(error)) {
    return 'No pudimos conectar con el catálogo. Revisa tu conexión e intenta nuevamente.';
  }

  return 'No pudimos cargar los alojamientos. Intenta nuevamente.';
}

export function getLoadMoreLodgingsErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'No pudimos cargar más alojamientos por un problema de conexión.';
  }

  return 'No pudimos cargar más alojamientos. Intenta nuevamente.';
}

export function getDestinationsErrorMessage(error: unknown): string {
  const code = getPublicApiErrorCode(error);

  if (code === PUBLIC_API_ERROR_CODES.REQUEST_VALIDATION_ERROR) {
    return 'La respuesta de destinos no fue válida. Intenta nuevamente.';
  }

  if (isNetworkError(error)) {
    return 'No pudimos cargar los destinos. Revisa tu conexión e intenta nuevamente.';
  }

  return 'No pudimos cargar los destinos. Intenta nuevamente.';
}

export function getDestinationContextErrorMessage(error: unknown): string {
  const code = getPublicApiErrorCode(error);

  if (code === PUBLIC_API_ERROR_CODES.INVALID_DESTINATION_ID) {
    return 'El destino seleccionado ya no es válido. Elige otro para continuar.';
  }

  if (code === PUBLIC_API_ERROR_CODES.REQUEST_VALIDATION_ERROR) {
    return 'No pudimos interpretar el destino seleccionado. Intenta nuevamente.';
  }

  if (isNetworkError(error)) {
    return 'No pudimos cargar el contexto del destino por un problema de conexión.';
  }

  return 'No pudimos cargar el contexto del destino seleccionado. Intenta nuevamente.';
}

export function getLodgingDetailErrorMessage(error: unknown): string {
  const code = getPublicApiErrorCode(error);

  if (code === PUBLIC_API_ERROR_CODES.INVALID_LODGING_ID) {
    return 'El alojamiento solicitado no es válido.';
  }

  if (code === PUBLIC_API_ERROR_CODES.LODGING_NOT_FOUND) {
    return 'El alojamiento que buscabas ya no está disponible.';
  }

  if (code === PUBLIC_API_ERROR_CODES.REQUEST_VALIDATION_ERROR) {
    return 'No pudimos interpretar el alojamiento solicitado.';
  }

  if (isNetworkError(error)) {
    return 'No pudimos cargar el alojamiento por un problema de conexión.';
  }

  return 'No pudimos abrir el alojamiento solicitado.';
}
