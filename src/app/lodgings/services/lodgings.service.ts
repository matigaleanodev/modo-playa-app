import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Lodging,
  PaginatedResponse,
  PublicLodgingsQuery,
} from '../models/lodging.model';

@Injectable({
  providedIn: 'root',
})
export class LodgingsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/lodgings`;

  getPaginated(query: PublicLodgingsQuery = {}): Observable<PaginatedResponse<Lodging>> {
    return this.http.get<PaginatedResponse<Lodging>>(this.baseUrl, {
      params: this.buildParams(query),
    });
  }

  getById(id: string): Observable<Lodging> {
    return this.http.get<Lodging>(`${this.baseUrl}/${id}`);
  }

  private buildParams(query: PublicLodgingsQuery): HttpParams {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== null && item !== undefined && item !== '') {
            params = params.append(key, String(item));
          }
        }
        continue;
      }

      params = params.set(key, String(value));
    }

    return params;
  }
}
