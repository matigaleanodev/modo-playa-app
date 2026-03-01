import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Lodging } from '../models/lodging.model';
import { LodgingsService } from '../services/lodgings.service';

export const lodgingResolver: ResolveFn<Lodging> = (route) => {
  const lodgingId = route.paramMap.get('id');
  if (!lodgingId) {
    throw new Error('Missing lodging id in route params');
  }

  return inject(LodgingsService).getById(lodgingId);
};
