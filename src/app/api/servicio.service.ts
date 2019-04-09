import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServicioService {
  // https://www.fundacionlengua.com/api/test/?token=2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da

  protected basePath = 'https://www.fundacionlengua.com/api';
  public defaultHeaders = new HttpHeaders();

  constructor(protected httpClient: HttpClient) {
  }

  public getTest(token?: string,
    responseType?: 'json' | 'text' | 'blob',
    observe: any = 'body',
    reportProgress: boolean = false): Observable<any> {

    let queryParameters = new HttpParams();
    if (token !== undefined && token !== null) {
      queryParameters = queryParameters.set('token', <any>token);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [
      'application/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.get(`${this.basePath}/test/`,
      {
        params: queryParameters,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
        responseType: responseType !== undefined ? (responseType as any) : 'json'
      }
    );
  }

  public putTest(body: any, token: string, finalizar: boolean, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling putApplicationRoleScope.');
    }
    if (token === null || token === undefined) {
      throw new Error('Required parameter id was null or undefined when calling putApplicationRoleScope.');
    }

    let queryParameters = new HttpParams();
    if (token !== undefined && token !== null) {
      queryParameters = queryParameters.set('token', <any>token);
    }
    if (finalizar !== undefined && finalizar !== null) {
      queryParameters = queryParameters.set('finalizar', <any>finalizar);
    }
    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [
      'application/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }


    return this.httpClient.put(`${this.basePath}/test/`,
      body, {
        params: queryParameters,
        withCredentials: null,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public selectHeaderAccept(accepts: string[]): string | undefined {
    if (accepts.length === 0) {
      return undefined;
    }

    const type = accepts.find(x => this.isJsonMime(x));
    if (type === undefined) {
      return accepts[0];
    }
    return type;
  }

  public isJsonMime(mime: string): boolean {
    const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
    return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
  }
}

// import {Injectable} from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Observable} from 'rxjs/Observable';

// const httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

// @Injectable()
// export class ServicioService {

//     constructor(private http: HttpClient) {}

//     // Uses http.get() to load data from a single API endpoint
//     public getTest(token?: string): Observable<any> {
//         // tslint:disable-next-line:max-line-length
//         return this.http.get('https://www.fundacionlengua.com/api/test/?token=2ab9586fc31a8e395fe7834b910fe5b784aa7ad60ed67a7c8a1b905fb4f921da');
//     }
// }
