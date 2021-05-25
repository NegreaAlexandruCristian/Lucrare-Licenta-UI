import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ZoneSearchService} from './utils/zone-search.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // @ts-ignore
  zoneType: string;

  title = 'WebGISApp';
  // @ts-ignore
  private activatedSubscriptionZoneSearchType: Subscription;

  constructor(private zoneSearchType: ZoneSearchService) {
  }

  ngOnInit(): void {
    this.activatedSubscriptionZoneSearchType = this.zoneSearchType.activatedZoneSearchTypeEmitter.subscribe((type: string) => {
      this.zoneType = type;
    });
  }

  ngOnDestroy(): void {
    this.activatedSubscriptionZoneSearchType.unsubscribe();
  }
}
