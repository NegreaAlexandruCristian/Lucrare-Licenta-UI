import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ZoneSearchService} from '../../utils/zone-search.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../../map/store/map.actions';
import {Point} from '../../models/Point.model';

@Component({
  selector: 'app-zone-search',
  templateUrl: './zone-search.component.html',
  styleUrls: ['./zone-search.component.css']
})
export class ZoneSearchComponent implements OnInit, OnDestroy {

  // @ts-ignore
  zoneLocationsForm: FormGroup;
  enable = false;
  // @ts-ignore
  private activatedSubscriptionZoneSearchType: Subscription;
  zoneLocationsType: any = ['Hospital', 'Pharmacy', 'Buss', 'Schools', 'University'];
  // @ts-ignore
  private currentLoc: Subscription;

  constructor(
    private zoneSearchService: ZoneSearchService,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
    this.zoneLocationsForm = new FormGroup({
      radius: new FormControl(500, [Validators.required, Validators.min(0)]),
      zoneLocations: new FormControl('', Validators.required)
    });
    this.activatedSubscriptionZoneSearchType = this.zoneSearchService.activatedZoneSearchTypeEmitter.subscribe(
      (type: string) => {
        if (type === 'normal') {
          this.enable = !this.enable;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.activatedSubscriptionZoneSearchType.unsubscribe();
  }

  requestZoneLocations(): void {
    const value = this.zoneLocationsForm.value;
    this.currentLoc = this.store.select('institutions').subscribe(
      (data) => {
        console.log(data);
        const point = new Point(value.zoneLocations.toLowerCase(), value.radius, data.currentLocation[0], data.currentLocation[1]);
        this.store.dispatch(
          MapActions.zoneLocations({point})
        );
      }
    );
    this.currentLoc.unsubscribe();
  }
}
