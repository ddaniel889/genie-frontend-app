import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,of} from  'rxjs';
import {  catchError,map } from 'rxjs/operators';
import { URL } from '../services/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public getData(url:string):Observable<any>{
    return this.http.get<any[]>(url).pipe(
      map( (resp: any) => {
      return resp;
      } )
    );
   }


   postAuthentication(url:string, data:any):Observable<any>{
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

}
