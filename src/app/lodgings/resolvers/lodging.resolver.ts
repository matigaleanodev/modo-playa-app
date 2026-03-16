import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Lodging } from '../models/lodging.model';
import { LodgingsService } from '../services/lodgings.service';
import { NavService } from '@shared/services/nav/nav.service';
import { ToastrService } from '@shared/services/toastr/toastr.service';
import { getLodgingDetailErrorMessage } from '@shared/http/public-api-error';

export const lodgingResolver: ResolveFn<Lodging | RedirectCommand> = async (route) => {
  const lodgingId = route.paramMap.get('id');
  if (!lodgingId) {
    throw new Error('Missing lodging id in route params');
  }

  const lodgingsService = inject(LodgingsService);
  const toastr = inject(ToastrService);
  const nav = inject(NavService);
  const router = inject(Router);

  try {
    return await firstValueFrom(lodgingsService.getById(lodgingId));
  } catch (error) {
    await toastr.danger(getLodgingDetailErrorMessage(error));
    nav.root('/home');
    return new RedirectCommand(router.parseUrl('/home'));
  }
};
