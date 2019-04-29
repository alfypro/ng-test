import { Component, OnInit } from '@angular/core';
import { GlobalesService } from '../servicios/globales/globales.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  constructor(public _global: GlobalesService) { }

}
