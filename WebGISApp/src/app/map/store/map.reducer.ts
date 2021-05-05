import {Institution} from '../../models/Institution.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';
import {Point} from '../../models/Point.model';

export interface State {
  institutions: Institution[];
  institutionType: string;
  point: Point;
}


const initialState: State = {
  institutions: [],
  institutionType: '',
  point: new Point('', 0, 0, 0)
};


// tslint:disable-next-line:variable-name
const _mapReducer = createReducer(
  initialState,
  on(
    MapActions.setInstitutions,
    (state, action) => ({
      ...state,
      institutions: [...action.institutions],
      institutionType: action.institutionType,
      point: action.point
    })
  )
);

// tslint:disable-next-line:typedef
export function mapReducer(state: State, action: Action) {
  return _mapReducer(state, action);
}
