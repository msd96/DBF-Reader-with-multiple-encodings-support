import { Component } from '@angular/core';
import { DbfViewerComponent } from './dbf-viewer/dbf-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DbfViewerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
