// https://www.fundacionlengua.com/api/test/

export interface Alumno {
    idTest: string;
    finalizado: string;
    email: string;
    referencia: string;
    fechaHora: string;
    test: string;
}

export interface Pantilla {
    id: string;
    nombre: string;
    descripcion: string;
    agrupacion: string;
}

export interface Respuesta {
    id: string;
    respuesta: string;
}

export interface Pregunta {
    id: string;
    enunciado: string;
    valor: string;
    respuestas: Respuesta[];
}

export interface Test {
    alumno: Alumno;
    pantilla: Pantilla;
    preguntas: Pregunta[];
}
