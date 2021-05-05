import {Component, OnInit} from '@angular/core';

import * as MapActions from '../../map/store/map.actions';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';
import {ZoneSearchService} from '../../utils/zone-search.service';

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.css']
})
export class DropDownMenuComponent implements OnInit {

  zoneSearch = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private zoneSearchService: ZoneSearchService
  ) {
  }

  ngOnInit(): void {
  }

  getInstitutions(type: string): void {
    this.store.dispatch(
      MapActions.getInstitutions({institutionType: type})
    );
    this.store.select('institutions').subscribe(
      data => {
        console.log(data.institutionType);
        console.log(data.institutions);
      }
    );
  }

  enableZoneSearch(): void {
    this.zoneSearch = true;
    this.zoneSearchService.activatedEmitter.next(this.zoneSearch);
  }
}
