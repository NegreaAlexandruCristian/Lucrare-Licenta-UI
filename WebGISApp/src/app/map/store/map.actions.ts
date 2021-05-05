import {createAction, props} from '@ngrx/store';
import {Institution} from '../../models/Institution.model';

export const getInstitutions = createAction(
  '[Map] Get Institutions'
);

export const setInstitutions = createAction(
  '[Map] Set Institutions',
  props<{
    institutions: Institution[];
  }>()
);
