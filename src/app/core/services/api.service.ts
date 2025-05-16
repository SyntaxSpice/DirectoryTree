import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export type ApiParams = { [param: string]: any };

interface RequestOptions {
  params?: ApiParams;
  body?: any;
  retryCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = '';
  private defaultRetryCount = 2;

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }

  private request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Observable<T> {
    const { params, body, retryCount } = options;

    const requestOptions = {
      params: new HttpParams({ fromObject: params || {} }),
      body: body,
    };

    return this.http
      .request<T>(method, `${this.baseUrl}/${endpoint}`, requestOptions)
      .pipe(
        retry(retryCount ?? this.defaultRetryCount),
        catchError(this.handleError)
      ) as Observable<T>;
  }

  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('GET', endpoint, options);
  }

  post<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('POST', endpoint, options);
  }

  put<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('PUT', endpoint, options);
  }

  patch<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('PATCH', endpoint, options);
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}
