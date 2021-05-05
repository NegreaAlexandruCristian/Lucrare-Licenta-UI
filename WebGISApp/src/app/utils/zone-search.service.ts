import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneSearchService {
  activatedEmitter = new Subject<boolean>();
}
