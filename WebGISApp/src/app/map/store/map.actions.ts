import {createAction, props} from '@ngrx/store';
import {Institution} from '../../models/Institution.model';
import {Point} from '../../models/Point.model';

export const getInstitutions = createAction(
  '[Map] Get Public Institutions',
  props<{
    institutionType: string
  }>()
);

export const zoneLocations = createAction(
  '[Map] Get Zone Locations',
  props<{
    point: Point;
  }>()
);

export const setInstitutions = createAction(
  '[Map] Set Institutions',
  props<{
    institutions: Institution[];
    institutionType: string;
    point: Point;
  }>()
);
