import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
  }
  title = 'WebGISApp';
}
