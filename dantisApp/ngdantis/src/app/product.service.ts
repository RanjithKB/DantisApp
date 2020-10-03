import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  uri: string = "http://localhost:3000/api/product";

  constructor(private http: HttpClient) { }

  getProductsList(): Observable<any> {
    return this.http.get<any>(`${this.uri}/getProducts`)
  }

  getTaxList(): Observable<any> {
    return this.http.get<any>(`${this.uri}/getTaxList`)
  }

  getPaymentModes(): Observable<any> {
    return this.http.get<any>(`${this.uri}/getPaymentModes`)
  }


  getproductdetails(productId): Observable<any> {
    let params = new HttpParams();
    params = params.append('productId', productId);
    return this.http.get<any>(`${this.uri}/getProductDetails`, { params: params })
  }

  deleteproduct(productId): Observable<any> {
    let params = new HttpParams();
    params = params.append('productId', productId);
    return this.http.delete<any>(`${this.uri}/deleteProduct`, { params: params })
  }

  updateProduct(user): Observable<any> {
    let uri = "http://localhost:3000/api/product/updateProduct";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<any>(uri, user, httpOptions)
      .pipe(catchError(this.handleError));
  }

  generateInvoice(invoiceData): Observable<any> {
    let uri = "http://localhost:3000/api/product/generateInvoice";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    return this.http.post<any>(uri, invoiceData, httpOptions)
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
