import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  token = '';
  // token = '2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da';
  // https://www.fundacionlengua.com/admin/index.php?tipo=articulos&opcion=editar&ent_id=74&filtro=1&opfiltro=5&q_iniA=2019-07-07+00%3A00%3A00&q_iniB=2019-07-09+00%3A00%3A00&q_secciones=499%2C501%2C503%2C505#
  step = 0;
  elementos: Array<Pregunta[]> = [];
  total = 0;
  plantilla: Pantilla = { id: '', agrupacion: '', descripcion: '', nombre: '' };
  alumnoEmail = '';
  alumnoReferencia = '';
  alumnoFechaHora = '';
  finalizado = false;
  contadorCorrectas: number[];
  contadorErroneas: number[];
  respuestas = [];
  puntos = 0;
  cargado = 2;
  mensaje = 'Cargando...';

  constructor(
    public _fb: FormBuilder,
    public _global: GlobalesService,
    private _servicio: ServicioService,
    private _scrollToService: ScrollToService,
    private _route: ActivatedRoute
  ) {
    this.formGroup = this._fb.group([]);
    // this.token = this._route.snapshot.paramMap.get('token');
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
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token !== null && this.token !== undefined) {
        this.cargarDatos();
      } else if (this.token !== undefined) {
        this.cargado = 2;
        this.mensaje = this.token + 'ERROR de acceso...';
      }
    });
  }

  cargarDatos(): void {
    let controles: any = {};
    this._global.loadingMostrar();
    this._servicio.getTest(this.token).subscribe(
      (test: Test) => {
        this._global.loadingOcultar();
        console.log(test);
        if (test === null) {
          this.mensaje = 'ERROR! La clave del cuestionario no es válida...';
          this.cargado = 2;
          return;
        }
        const respuestas = JSON.parse(test.alumno.test);
        this.plantilla = test.pantilla;
        this.alumnoEmail = test.alumno.email;
        this.alumnoReferencia = test.alumno.referencia;
        this.alumnoFechaHora = test.alumno.fechaHora;
        this.finalizado = test.alumno.finalizado === '1' ? true : false;
        if (this.finalizado) {
          test.preguntas.forEach((p, i) => {
            this.respuestas[p.id] = {
              correcta: '',
              respuesta: '',
              acierto: false
            };
            const correcta = p.respuestas.filter((x: any) => x.esCorrecta === '1');
            if (correcta.length) {
              this.respuestas[p.id].correcta = correcta[0].respuesta;
            }
            if (respuestas[p.id] !== undefined && respuestas[p.id] !== null) {
              const respuesta = p.respuestas.filter((x: any) => x.id === respuestas[p.id]);
              if (respuesta.length) {
                this.respuestas[p.id].respuesta = respuesta[0].respuesta;
              }
            }
            if (this.respuestas[p.id].correcta === this.respuestas[p.id].respuesta && this.respuestas[p.id].respuesta !== '') {
              this.respuestas[p.id].acierto = true;
              this.puntos += Number(p.valor);
            }
          });
        } else {
          test.preguntas.forEach(p => {
            controles = { ...controles, [p.id]: [{ value: (respuestas[p.id] !== undefined && respuestas[p.id] !== null ? respuestas[p.id] : null), disabled: false }, null] };
          });
        }
        this.formGroup = this._fb.group(controles);
        this.elementos = this.generarElementos(test.preguntas, Number(test.pantilla.agrupacion));
        this.total = this.elementos.length;
        this.cargado = 1;
      },
      error => {
        this._global.loadingOcultar();
        this.mensaje = 'ERROR! La clave del cuestionario no es válida...';
        this.cargado = 2;
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
    if (preguntas.length > 0) {
      partes[index] = preguntas.slice(0, grupos);
    }
    // console.log(preguntas.length + ' - ' + index + ' - ' + grupos);
    // for (let i = index; i < preguntas.length; i++) {
    //   partes[index + 1] = preguntas.slice(0, grupos);
    //   preguntas = preguntas.slice(grupos);
    // }
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
        location.reload();
      }
    });
  }
  guardar(finalizar: boolean): void {
    const body = Object.assign({}, this.formGroup.getRawValue());
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
