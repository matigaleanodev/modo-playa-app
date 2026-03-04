import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Destination,
  DestinationContext,
  DestinationId,
} from '../models/destination.model';

@Injectable({
  providedIn: 'root',
})
export class DestinationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/destinations`;

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.baseUrl);
  }

  getContextByDestinationId(id: DestinationId): Observable<DestinationContext> {
    return this.http.get<DestinationContext>(`${this.baseUrl}/${id}/context`);
  }
}
