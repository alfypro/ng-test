import { Component, OnInit } from '@angular/core';
import { ServicioService } from './api/servicio.service';
import { Test, Pregunta, Pantilla } from './modelo/modelo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { GlobalesService } from './modelo/servicios/globales/globales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public formGroup: FormGroup;
  token = '2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da';
  step = 0;
  elementos: Array<Pregunta[]> = [];
  total = 0;
  plantilla: Pantilla = { id: '', agrupacion: '', descripcion: '', nombre: '' };
  alumnoEmail = '';
  finalizado = false;
  contadorCorrectas: number[];
  contadorErroneas: number[];

  constructor(
    public _fb: FormBuilder,
    public _global: GlobalesService,
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
    this.guardar(false);
  }

  prevStep() {
    this.step--;
    this.situarse(`apartado_${this.step}`);
  }

  ngOnInit() {
    let controles: any = {};
    this._global.loadingMostrar();
    this._servicio.getTest(this.token).subscribe(
      (test: Test) => {
        this._global.loadingOcultar();
        console.log(test);
        const respuestas = JSON.parse(test.alumno.test);
        this.plantilla = test.pantilla;
        this.alumnoEmail = test.alumno.email;
        this.finalizado = test.alumno.finalizado === '1' ? true : false;
        test.preguntas.forEach(p => {
          controles = { ...controles, [p.id]: [{ value: (respuestas[p.id] !== undefined && respuestas[p.id] !== null ? respuestas[p.id] : null), disabled: false }, null] };
        });
        this.formGroup = this._fb.group(controles);
        this.elementos = this.generarElementos(test.preguntas, Number(test.pantilla.agrupacion));
        this.total = this.elementos.length;
      },
      error => {
        this._global.loadingOcultar();
        console.error(error);
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

  onSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    Swal.fire({
      title: '¡Atención!',
      text: '¿Seguro que desea completar el cuestionario?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#27c24c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.guardar(true);
      }
    });
  }
  guardar(finalizar: boolean): void {
    const body = Object.assign({}, this.formGroup.getRawValue());
    console.log(body);
    this._servicio.putTest(body, this.token, finalizar).subscribe(
      respuesta => {
        console.log(respuesta);
      },
      error => {
        console.log(error);
      }
    );
  }

}
