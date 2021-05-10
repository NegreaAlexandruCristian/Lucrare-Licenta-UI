import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../../map/store/map.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  // @ts-ignore
  searchLocationForm: FormGroup;
  // @ts-ignore
  private subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.searchLocationForm = new FormGroup({
      searchInput: new FormControl('', [Validators.pattern('^[a-zA-Z\\s.]*$'), Validators.required])
    });
  }

  searchLocation(): void {
    const locationName: string = this.searchLocationForm.value.searchInput;
    this.store.dispatch(
      MapActions.searchInstitution({institutionName: locationName})
    );
    this.subscription = this.store.select('institutions').subscribe(
      error => {
        if (error.errorMessage) {
          alert(error.errorMessage);
          this.store.dispatch(
            MapActions.searchFailed({errorMessage: ''})
          );
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
