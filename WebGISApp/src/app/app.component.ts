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

  enable = false;
  // @ts-ignore
  private activatedSubscription: Subscription;

  constructor(private zoneSearchService: ZoneSearchService) {
  }

  title = 'WebGISApp';

  ngOnInit(): void {
    this.activatedSubscription = this.zoneSearchService.activatedEmitter.subscribe((didActivate: boolean) => {
      this.enable = didActivate;
    });
  }

  ngOnDestroy(): void {
    this.activatedSubscription.unsubscribe();
  }
}
