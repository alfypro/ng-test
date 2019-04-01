import { Component, OnInit } from '@angular/core';
import { ServicioService } from './api/servicio.service';
import { Test, Pregunta } from './modelo/modelo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step = 0;
  elementos: Array<Pregunta[]>;

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
    // const test =
    this._servicio.getTest(token).subscribe(
      (test: Test) => {
        console.log(test);
        this.elementos = this.generarElementos(test.preguntas, Number(test.pantilla.agrupacion));
        console.log(this.elementos);
      },
      error => {
        console.log(error);
      }
    );
  }

  generarElementos(preguntas: Pregunta[], grupos: number): Array<Pregunta[]> {
    const partes: Array<Pregunta[]> = [];
    let index = 0;
    do {
      partes[index] = preguntas.slice(0, grupos);
      preguntas = preguntas.slice(grupos);
      index++;
    } while (preguntas.length > grupos);
    return partes;
  }

}
