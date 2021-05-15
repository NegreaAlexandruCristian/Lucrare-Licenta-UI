import {createAction, props} from '@ngrx/store';
import {Institution} from '../../models/Institution.model';
import {Point} from '../../models/Point.model';

export const searchFailed = createAction(
  '[Map] Search Failed',
  props<{
    errorMessage: string
  }>()
);

export const getInstitutions = createAction(
  '[Map] Get Public Institutions',
  props<{
    institutionType: string
  }>()
);

export const searchInstitution = createAction(
  '[Map] Get Institution by name',
  props<{
    institutionName: string
  }>()
);

export const zoneLocations = createAction(
  '[Map] Get Zone Locations',
  props<{
    point: Point;
  }>()
);

export const setCurrentLocation = createAction(
  '[Map] Get Current Location',
  props<{
    currentLocation: number[]
  }>()
);

export const setInstitutions = createAction(
  '[Map] Set Institutions',
  props<{
    institutions: Institution[];
    institutionName: string;
    institutionType: string;
    point: Point;
  }>()
);
