import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as MapActions from './map.actions';
import {map, switchMap} from 'rxjs/operators';
import {Institution} from '../../models/Institution.model';
import {Point} from '../../models/Point.model';

function getInstitutionType(code: string): string {
  switch (code) {
    case ('hospital'):
    case ('pharmacy'):
      return 'medical';
    case ('school'):
    case ('university'):
      return 'public';
    case ('bus-stop'):
      return 'transport';
    default:
      return 'public';
  }
}

@Injectable()
export class MapEffects {

  private point = new Point('', 0, 0, 0);

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) {
  }

  getZoneInstitutions = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.zoneLocations),
      switchMap((action) => {
        this.point = action.point;
        return this.http.post<Institution[]>(
          `http://localhost:8662/api/user/location/${
            action.point.code !== '' ? action.point.code : 'all'
          }`,
          action.point
        );
      }),
      map((institutions) => {
        return institutions.map(institution => {
          return {
            ...institution
          };
        });
      }),
      map(institutions => {
        return MapActions.setInstitutions(
          {
            institutions,
            institutionType: getInstitutionType(institutions[0].code),
            point: this.point
          });
      })
    )
  );

  getInstitutions = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.getInstitutions),
      switchMap((action) => {
        return this.http.get<Institution[]>(
          `http://localhost:8662/api/${action.institutionType}/locations/get`
        );
      }),
      map((institutions) => {
        return institutions.map(institution => {
          return {
            ...institution
          };
        });
      }),
      map(institutions => {
        return MapActions.setInstitutions(
          {
            institutions,
            institutionType: getInstitutionType(institutions[0].code),
            point: this.point,
          });
      })
    )
  );
}
