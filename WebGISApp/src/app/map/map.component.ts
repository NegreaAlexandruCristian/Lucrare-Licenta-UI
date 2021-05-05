import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';

import * as L from 'leaflet';
import * as Utils from '../utils/configuration';
import * as fromApp from '../store/app.reducer';
import * as MapActions from '../map/store/map.actions';

@Component({
  selector: 'app-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css', '../app.component.css']
})
export class MapComponent implements OnInit {

  errorMessage = '';

  private iconRetinaUrl = 'assets/marker-icon-2x.png';
  private iconUrl = 'assets/marker-icon.png';
  private shadowUrl = 'assets/marker-shadow.png';

  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconRetinaUrl: this.iconRetinaUrl,
      iconUrl: this.iconUrl,
      shadowUrl: this.shadowUrl
    })
  };

  constructor(private store: Store<fromApp.AppState>) {
  }

  handleError(error: any): void {
    this.errorMessage = error.message;
    console.log(error);
  }

  ngOnInit(): void {
    this.store.dispatch(
      MapActions.getInstitutions()
    );
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.setGeoLocation.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  setGeoLocation(position: { coords: { latitude: any; longitude: any } }): void {
    const {coords: {latitude, longitude}, } = position;

    const map = L.map('map').setView([latitude, longitude], Utils.MAP_ZOOM_LEVEL);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
    }).addTo(map);

    L.marker([latitude, longitude], this.icon)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: true,
          className: 'marker-popup'
        }))
      .setPopupContent(
        'Here I am 😀!'
      )
      .openPopup();
  }
}
