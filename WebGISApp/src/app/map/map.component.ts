import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';

import * as L from 'leaflet';
import * as Utils from '../utils/configuration';
import * as fromApp from '../store/app.reducer';
import * as MapActions from '../map/store/map.actions';
import {Institution} from '../models/Institution.model';


@Component({
  selector: 'app-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css', '../app.component.css']
})
export class MapComponent implements OnInit {

  errorMessage = '';
  private map: any;
  private currentPositionMarker: any;
  private markers = L.markerClusterGroup();
  private markersPositions: Array<Array<number>> = [[]];

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

  deleteMarkersFromMap(): void {
    if (this.markers && this.map) {
      for (const marker of this.markers.getLayers()) {
        this.map.removeLayer(marker);
      }
      this.markers.clearLayers();
    }
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.setGeoLocation.bind(this),
        this.handleError.bind(this)
      );
    }
    this.store.select('institutions').subscribe(
      (data) => {
        if (data.institutions.length > 0) {
          this.deleteMarkersFromMap();
          data.institutions.forEach(
            institution => {
              this.addMarker(institution);
              this.map.addLayer(this.markers);
            }
          );
          try {
            this.map?.fitBounds(this.markersPositions);
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  }

  setGeoLocation(position: { coords: { latitude: any; longitude: any } }): void {
    const {coords: {latitude, longitude}} = position;

    this.map = L.map('map').setView([latitude, longitude], Utils.MAP_ZOOM_LEVEL, {
      animate: true,
      duration: 1000
    });

    L.tileLayer(Utils.LEAFLET_MAP_URL, {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
    }).addTo(this.map);

    this.currentPositionMarker = L.marker([latitude, longitude], this.icon)
      .addTo(this.map)
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
    const currentLoc = [this.currentPositionMarker.getLatLng().lat, this.currentPositionMarker.getLatLng().lng];
    this.store.dispatch(
      MapActions.setCurrentLocation({currentLocation: currentLoc})
    );
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: { coords: { latitude: any; longitude: any } }) => {
          const {coords: {latitude, longitude}} = position;
          this.map.setView([latitude, longitude], Utils.MAP_ZOOM_LEVEL, Utils.MAP_CONFIGURATIONS);
          this.currentPositionMarker.openPopup();
        },
        this.handleError.bind(this)
      );
    }
    const currentLoc = [this.currentPositionMarker.getLatLng().lat, this.currentPositionMarker.getLatLng().lng];
    this.store.dispatch(
      MapActions.setCurrentLocation({currentLocation: currentLoc})
    );
  }

  private addMarker(institution: Institution): void {
    let marker;
    this.markersPositions.push([institution.latitude, institution.longitude]);
    marker = L.marker([institution.latitude, institution.longitude], this.icon)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: true,
          className: 'marker-popup'
        }))
      .setPopupContent(
        `${institution.code.toUpperCase()
        } : ${institution.name}`
      )
      .openPopup();
    this.markers.addLayer(marker);
  }
}
