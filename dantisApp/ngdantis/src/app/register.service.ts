import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  uri: string = "http://localhost:3000/api/userModel";


  constructor(private http: HttpClient) { }

  postRegisterUser(user): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<any>(this.uri, user, httpOptions)
      .pipe(catchError(this.handleError));
  }

  authenticateUser(uName, pwd): Observable<any> {
    let params = new HttpParams();
    params = params.append('uName', uName);
    params = params.append('pwd', pwd);

    return this.http.get<any>(`${this.uri}/auth`, { params: params })
  }

  isUnameExists(uName): Observable<any> {
    let params = new HttpParams();
    params = params.append('uName', uName);

    return this.http.get<any>(`${this.uri}/exists`, { params: params })
  }

  getUsersList(): Observable<any> {
    return this.http.get<any>(`${this.uri}/getUser`)
  }

  deleteUser(productId): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', productId);
    return this.http.delete<any>(`${this.uri}/deleteUser`, { params: params });
  }

  getUserdetails(userId): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId);
    return this.http.get<any>(`${this.uri}/getUserDetails`, { params: params })
  }

  updateUser(user): Observable<any> {
    let uri = "http://localhost:3000/api/userModel/updateUser";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<any>(uri, user, httpOptions)
      .pipe(catchError(this.handleError));
  }

  postpProduct(user): Observable<any> {
    let uri: string = "http://localhost:3000/api/product";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<any>(uri, user, httpOptions)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
