import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as MapActions from './map.actions';
import {switchMap, map} from 'rxjs/operators';
import {Institution} from '../../models/Institution.model';

@Injectable()
export class MapEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) {
  }

  getInstitutions = createEffect( () =>
    this.actions$.pipe(
      ofType(MapActions.getInstitutions),
      switchMap( () => {
        return this.http.get<Institution[]>(
            'http://localhost:8662/api/public/locations/get'
        );
      }),
      map(institutions => {
        return institutions.map(institution => {
          return {
            ...institution
          };
        });
      }),
      map(institutions => {
        return MapActions.setInstitutions(
          {institutions});
      })
    )
  );
}
