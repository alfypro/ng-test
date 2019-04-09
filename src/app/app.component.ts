import { Component, OnInit } from '@angular/core';
import { ServicioService } from './api/servicio.service';
import { Test, Pregunta, Pantilla } from './modelo/modelo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public formGroup: FormGroup;
  step = 0;
  elementos: Array<Pregunta[]> = [];
  total = 0;
  plantilla: Pantilla = { id: '', agrupacion: '', descripcion: '', nombre: '' };

  constructor(
    public _fb: FormBuilder,
    private _servicio: ServicioService,
    private _scrollToService: ScrollToService
  ) {
    this.formGroup = this._fb.group([]);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    this.situarse(`apartado_${this.step}`);
  }

  prevStep() {
    this.step--;
    this.situarse(`apartado_${this.step}`);
  }

  ngOnInit() {
    const token = '2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da';
    let controles: any = {};
    this._servicio.getTest(token).subscribe(
      (test: Test) => {
        console.log(test);
        this.plantilla = test.pantilla;
        test.preguntas.forEach(p => {
          controles = { ...controles, [p.id]: [{ value: null, disabled: false }, null] };
        });
        this.formGroup = this._fb.group(controles);
        this.elementos = this.generarElementos(test.preguntas, Number(test.pantilla.agrupacion));
        this.total = this.elementos.length;
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

  situarse(target: string): void {
    if (target === undefined) {
      return;
    }
    // Configuramos las opciones para hacer el scroll
    const config: ScrollToConfigOptions = {
      target: target,
      offset: -20,
      duration: 300
    };
    // Dejamos un margen para que de tiempo a que se cierre en anterior panel
    // Si es el maldito Internet Explorer le damos más tiempo
    if (/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)) {
      setTimeout(() => this._scrollToService.scrollTo(config), 800);
    } else {
      setTimeout(() => this._scrollToService.scrollTo(config), 300);
    }
  }

}
