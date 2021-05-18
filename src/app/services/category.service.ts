import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,of} from  'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL } from '../services/constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getData(url:string):Observable<any>{
    return this.http.get<any[]>(url).pipe(
      map( (resp: any) => {
      return resp;
      } )
    );
   }


   public post(url:string, data:any):Observable<any>{
    console.log(data);
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post<any[]>(URL.BASE+url,data, {headers: headers}).pipe(
        map(
          resp => {
            console.log(resp);
            return resp;
           }
          ),
        catchError(this.handleError<any>())
    );
   }

   private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
  };
}


public get(url: string, webToken:string): Observable<any> {
  let headers = new HttpHeaders();
  headers.append('Authorization',webToken);
 
  return this.http.get( URL.BASE + url , {
      headers: headers,
  }).pipe(
      map(this.parseResponse),
      catchError(this.handleError<any>())
  );
}

public delete(url: string, id: string,webToken:string): Observable<any>  {
  let headers = new HttpHeaders();
  headers.append('Authorization',webToken);
  return this.http.delete(URL.BASE + url + id, {
      headers: headers,
  }).pipe(
      map(this.parseResponse),
      catchError(this.handleError<any>())
      );
  }


  protected parseResponse(r: any): any {
    if (r.success !== true) {
        throw new Error(r.message);
    }
    return r.data;
}  



}
