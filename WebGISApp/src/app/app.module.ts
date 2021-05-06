import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {MapComponent} from './map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {ErrorComponent} from './error/error.component';
import {SearchBarComponent} from './shared/search-bar/search-bar.component';
import {HttpClientModule} from '@angular/common/http';
import {EffectsModule} from '@ngrx/effects';
import {MapEffects} from './map/store/map.effects';
import {StoreModule} from '@ngrx/store';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import * as fromMap from '../app/map/store/map.reducer';
import {DropDownMenuComponent} from './shared/drop-down-menu/drop-down-menu.component';
import {ZoneSearchComponent} from './shared/zone-search/zone-search.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ErrorComponent,
    SearchBarComponent,
    DropDownMenuComponent,
    ZoneSearchComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('institutions', fromMap.mapReducer),
    EffectsModule.forRoot([MapEffects]),
    LeafletModule,
    LeafletMarkerClusterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
