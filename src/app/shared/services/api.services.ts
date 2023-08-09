import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/assets/environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export abstract class ApiService<T> {
  url:string;
  constructor(
    protected http: HttpClient,
    @Inject("apiPath") protected apiPath: string
  ) { 
    this.getUrl();
  }

  getUrl(){
    this.url = environment.basePath + this.apiPath;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url)
  }

  get(id: number | string): Observable<T> {
    return this.http.get<T>(this.url + "/" + id, httpOptions)
  }

  create(dataToSend: T) {
    return this.http.post(this.url, dataToSend, httpOptions);
  }

  update(dataToSend: T) {
    return this.http.put(this.url + "/edit", dataToSend, httpOptions);
  }

  delete(id: number | string) {
    return this.http.delete(this.url + "/" + id, httpOptions);
  }

  custom(customGet: string, id: number | string){
    return this.http.get(this.url + "/" + customGet + "/" + id, httpOptions);
  }
}