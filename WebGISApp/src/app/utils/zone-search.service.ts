import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CoordinatesModel} from '../models/Coordinates.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneSearchService {
  activatedZoneSearchTypeEmitter = new Subject<string>();
  sendMapCoordinates = new Subject<CoordinatesModel>();
}
