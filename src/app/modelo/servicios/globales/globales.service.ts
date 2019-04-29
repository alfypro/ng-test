import { Injectable } from '@angular/core';

// Ha sido iniciada directamente en app.module.ts
@Injectable()
export class GlobalesService {

  // Declaraciones
  public loading = 0; // Para el loading
  private loadingContador = 0;
  private loadingTimeoutId: any; // NodeJS.Timer; // Referencia al timeout del loading

  // Operaciones loading
  public loadingMostrar = () => {
    if (this.loading === 0) {
      this.loadingContador++;
      if (this.loadingTimeoutId === undefined) {
        this.loadingTimeoutId = setTimeout(() => {
          this.loading += this.loadingContador;
          if (this.loadingTimeoutId !== undefined) {
            clearTimeout(this.loadingTimeoutId);
            this.loadingTimeoutId = undefined;
            this.loadingContador = 0;
          }
        }, 250);
      }
    } else {
      this.loading++;
    }
  }
  public loadingOcultar = () => {
    if (this.loadingTimeoutId !== undefined) {
      if (this.loadingContador === 1) {
        clearTimeout(this.loadingTimeoutId);
        this.loadingTimeoutId = undefined;
        this.loadingContador = 0;
      } else {
        this.loadingContador--;
      }
    }

    if (this.loading > 0) {
      this.loading--;
    } else {
      this.loading = 0;
    }
  }
  public loadingKill = () => this.loading = 0;
}
