import {Component, OnInit} from '@angular/core';

import * as MapActions from '../../map/store/map.actions';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.css']
})
export class DropDownMenuComponent implements OnInit {

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
  }

  getPublicLocations(): void {
    this.store.dispatch( MapActions.getInstitutions() );
  }
}
