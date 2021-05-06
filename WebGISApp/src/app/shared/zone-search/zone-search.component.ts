import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ZoneSearchService} from '../../utils/zone-search.service';

@Component({
  selector: 'app-zone-search',
  templateUrl: './zone-search.component.html',
  styleUrls: ['./zone-search.component.css']
})
export class ZoneSearchComponent implements OnInit, OnDestroy {

  enable = false;
  // @ts-ignore
  private activatedSubscription: Subscription;

  constructor(private zoneSearchService: ZoneSearchService) {
  }

  ngOnInit(): void {
    this.activatedSubscription = this.zoneSearchService.activatedEmitter.subscribe((didActivate: boolean) => {
      this.enable = didActivate;
    });
  }

  ngOnDestroy(): void {
    this.activatedSubscription.unsubscribe();
  }

}
