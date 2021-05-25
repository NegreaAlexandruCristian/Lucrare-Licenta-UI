import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ZoneSearchService} from '../../utils/zone-search.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {Point} from '../../models/Point.model';
import * as MapActions from '../../map/store/map.actions';

@Component({
  selector: 'app-zone-search-geo-tools',
  templateUrl: './zone-search-geo-tools.component.html',
  styleUrls: ['./zone-search-geo-tools.component.css']
})
export class ZoneSearchGeoToolsComponent implements OnInit, OnDestroy {

  // @ts-ignore
  zoneLocationsForm: FormGroup;
  enable = false;
  zoneLocationsType: any = ['Hospital', 'Pharmacy', 'Buss', 'Schools', 'University'];
  // @ts-ignore
  private activatedSubscriptionZoneSearchType: Subscription;
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
      latitude: new FormControl(45.00, [Validators.required]),
      longitude: new FormControl(25.00, [Validators.required]),
      zoneLocations: new FormControl('', Validators.required)
    });
    this.activatedSubscriptionZoneSearchType = this.zoneSearchService.activatedZoneSearchTypeEmitter.subscribe(
      (type: string) => {
        if (type === 'geo-tools') {
          this.enable = !this.enable;
        }
      }
    );
    this.zoneSearchService.sendMapCoordinates.subscribe((data) => {
      this.zoneLocationsForm.patchValue({
        latitude: data.latitude,
        longitude: data.longitude
      });
    });
  }

  ngOnDestroy(): void {
    this.activatedSubscriptionZoneSearchType.unsubscribe();
  }

  requestZoneLocationsGeoTools(): void {
    const value = this.zoneLocationsForm.value;
    this.currentLoc = this.store.select('institutions').subscribe(
      () => {
        const point = new Point(value.zoneLocations.toLowerCase(), value.radius, value.latitude, value.longitude);
        this.store.dispatch(
          MapActions.zoneLocationsGeoTools({point})
        );
      }
    );
    this.currentLoc.unsubscribe();
  }
}
