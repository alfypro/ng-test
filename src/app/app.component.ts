import { Component, OnInit } from '@angular/core';
import { ServicioService } from './api/servicio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step = 0;

  constructor(private _servicio: ServicioService) {}

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {
    const token = '2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da';
    const test = this._servicio.getTest(token);
    console.log(test);
  }
}
