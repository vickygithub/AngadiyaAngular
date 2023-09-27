import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CrudService {
  private headers!: HttpHeaders;

  constructor(
    private http: HttpClient,
    public router: Router) {
  }

  private setHeaders() {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  }


  public getByUrl(url: any) {
    this.setHeaders();
    const request = this.httpGet(environment.API_URL + url, { headers: this.headers, body: '' });
    return request;
  }

  public httpGet(url: any, requestOptions: any) {
    const request = this.http.get(url, requestOptions);
    return request;
  }

  public postByUrl(url: any, data: any) {
    this.setHeaders();
    const request = this.http.post(environment.API_URL + url, JSON.stringify(data), { headers: this.headers });
    return request;
  }



  public updateByUrl(url: any, data: any) {
    this.setHeaders();
    const request = this.http.put(environment.API_URL + url, JSON.stringify(data), { headers: this.headers });
    return request;
  }

  public deleteByUrl(url: any) {
    this.setHeaders();
    return this.http.delete(environment.API_URL + url, { headers: this.headers });
  }


}
