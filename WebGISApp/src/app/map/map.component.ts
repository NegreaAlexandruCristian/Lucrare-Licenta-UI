import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngrx/store';

import * as L from 'leaflet';
import {LeafletEvent} from 'leaflet';
import 'leaflet-routing-machine';
import * as Utils from '../utils/configuration';
import * as fromApp from '../store/app.reducer';
import * as MapActions from '../map/store/map.actions';
import {Institution} from '../models/Institution.model';
import {ZoneSearchService} from '../utils/zone-search.service';
import {CoordinatesModel} from '../models/Coordinates.model';

@Component({
  selector: 'app-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css',
    '../app.component.css',
    '../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css'
  ]
})
export class MapComponent implements OnInit {

  errorMessage = '';
  private map: any;
  private currentPositionMarker: any;
  private markers = L.markerClusterGroup();
  private markersPositions: Array<Array<number>> = [[]];
  private calculateDistanceMarkers: any = [];

  private iconRetinaUrl = 'assets/marker-icon-2x.png';
  private iconUrl = 'assets/marker-icon.png';
  private shadowUrl = 'assets/marker-shadow.png';
  private routingMachineEnabled = false;
  private routingCalculator: any;
  private redIconUrl = 'assets/marker-icon-red.png';
  private redIconRetinaUrl = 'assets/marker-icon-2x-red.png';

  defaultIcon = L.Icon.extend({
    options: {
      iconSize: [26, 42],
      iconAnchor: [13, 13],
      iconRetinaUrl: this.iconRetinaUrl,
      iconUrl: this.iconUrl,
      shadowUrl: this.shadowUrl,
    }
  });

  markerSelectedIcon = L.Icon.extend({
    options: {
      iconSize: [26, 42],
      iconAnchor: [13, 13],
      iconRetinaUrl: this.redIconRetinaUrl,
      iconUrl: this.redIconUrl,
      shadowUrl: this.shadowUrl,
    }
  });

  constructor(
    private store: Store<fromApp.AppState>,
    private zoneSearchService: ZoneSearchService
  ) {
  }

  handleError(error: any): void {
    this.errorMessage = error.message;
  }

  deleteMarkersFromMap(): void {
    if (this.markers && this.map) {
      for (const marker of this.markers.getLayers()) {
        this.map.removeLayer(marker);
      }
      this.markers.clearLayers();
    }
    this.markersPositions = [];
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
              if (this.routingCalculator) {
                this.map.removeControl(this.routingCalculator);
                this.calculateDistanceMarkers = [];
                this.routingMachineEnabled = false;
              }
              this.addMarker(institution);
              this.map.addLayer(this.markers);
            }
          );
          try {
            if (data.institutionName !== '') {
              const latData = data.institutions[0].latitude;
              const lngData = data.institutions[0].longitude;
              this.map?.fitBounds([[latData, lngData]]);
            } else {
              this.map?.fitBounds(this.markersPositions);
            }
          } catch (error) {
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
    this.map.on('click', (event: { latlng: any; }) => {
      const {lat: markerLatitude, lng: markerLongitude} = event.latlng;
      const coords = new CoordinatesModel(markerLatitude, markerLongitude);
      this.zoneSearchService.sendMapCoordinates.next(coords);
    });

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: this.iconRetinaUrl,
      iconUrl: this.iconUrl,
      shadowUrl: this.shadowUrl
    });

    L.tileLayer(Utils.LEAFLET_MAP_URL, {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // tslint:disable-next-line:new-parens
    this.currentPositionMarker = L.marker([latitude, longitude], new this.defaultIcon)
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
      .openPopup()
      .on('mouseover', (event) => {
        event.target.openPopup();
      })
      .on('mouseout', (event) => {
        event.target.closePopup();
      })
      .on('click', this.markerAction.bind(this));
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

  markerAction(event: LeafletEvent): void {
    let markersClicked = this.calculateDistanceMarkers.length;

    const index = this.calculateDistanceMarkers.indexOf(event.target);
    if (index >= 0) {
      // tslint:disable-next-line:new-parens
      event.target.setIcon(new this.defaultIcon);
      this.calculateDistanceMarkers.splice(index, 1);
      if (this.routingCalculator !== undefined) {
        this.map.removeControl(this.routingCalculator);
      }
      this.routingMachineEnabled = false;
    } else {
      switch (markersClicked) {
        case 0:
          // tslint:disable-next-line:new-parens
          event.target.setIcon(new this.markerSelectedIcon);
          this.calculateDistanceMarkers = [event.target];
          break;
        case 1:
          // tslint:disable-next-line:new-parens
          event.target.setIcon(new this.markerSelectedIcon);
          this.calculateDistanceMarkers.push(event.target);
          break;
      }
    }
    markersClicked = this.calculateDistanceMarkers.length;
    if (markersClicked === 2 && !this.routingMachineEnabled) {
      this.routingMachineEnabled = true;
      this.calculateDistanceBetweenTwoMarkers();
    }
  }

  private calculateDistanceBetweenTwoMarkers(): void {

    const {lat: startLat, lng: startLng} = this.calculateDistanceMarkers[0]._latlng;
    const {lat: stopLat, lng: stopLng} = this.calculateDistanceMarkers[1]._latlng;

    this.routingCalculator = L.Routing.control({
      router: L.Routing.mapbox(Utils.MAP_BOX_API_KEY, {}),
      // @ts-ignore
      lineOptions: {
        styles: [{className: 'animate'}] // Adding animate class
      },
      waypoints: [
        L.latLng(startLat, startLng),
        L.latLng(stopLat, stopLng)
      ],

      createMarker(): any {
        return null;
      },
    }).addTo(this.map);
  }

  private addMarker(institution: Institution): void {
    let marker;
    this.markersPositions.push([institution.latitude, institution.longitude]);
    // tslint:disable-next-line:new-parens
    marker = L.marker([institution.latitude, institution.longitude], new this.defaultIcon)
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
      .openPopup()
      .on('mouseover', (event) => {
        event.target.openPopup();
      })
      .on('mouseout', (event) => {
        event.target.closePopup();
      })
      .on('click', this.markerAction.bind(this));
    this.markers.addLayer(marker);
  }
}
