import {Institution} from '../../models/Institution.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';

export interface State {
  institutions: Institution[];
}


const initialState: State = {
  institutions: []
};


// tslint:disable-next-line:variable-name
const _mapReducer = createReducer(
  initialState,
  on(
    MapActions.setInstitutions,
    (state, action) => ({
      ...state,
      institutions: [...action.institutions]
    })
  )
);

// tslint:disable-next-line:typedef
export function mapReducer(state: State, action: Action) {
  return _mapReducer(state, action);
}
