import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as MapActions from './map.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Institution} from '../../models/Institution.model';
import {Point} from '../../models/Point.model';
import {of} from 'rxjs';

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

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error) {
    return of(MapActions.searchFailed({errorMessage}));
  }
  switch (errorRes.status) {
    case 404:
      errorMessage = 'The location does not exits, please search again!';
      break;
  }
  return of(MapActions.searchFailed({errorMessage}));
};

@Injectable()
export class MapEffects {

  private point = new Point('', 0, 0, 0);

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) {
  }

  searchInstitutionByName = createEffect(
    () => this.actions$.pipe(
      ofType(MapActions.searchInstitution),
      switchMap((action) => {
        return this.http.get<Institution>(
          `http://localhost:8662/api/user/location/get/name/${action.institutionName}`
        ).pipe(
          map(institution => {
            return MapActions.setInstitutions(
              {
                // @ts-ignore
                institutions: [institution],
                // @ts-ignore
                institutionType: getInstitutionType(institution.code),
                point: this.point,
              });
          }),
          catchError((errorResponse => {
            return handleError(errorResponse);
          })),
        );
      })
    )
  );

  getZoneInstitutions = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.zoneLocations),
      switchMap((action) => {
        this.point = action.point;
        return this.http.post<Institution[]>(
          `http://localhost:8662/api/user/location/${
            action.point.code !== 'all' ? 'zone' : 'all'
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
            institutionType: getInstitutionType(this.point.code),
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
