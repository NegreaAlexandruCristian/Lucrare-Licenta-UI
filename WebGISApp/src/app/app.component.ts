import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor() {
  }

  title = 'WebGISApp';

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
