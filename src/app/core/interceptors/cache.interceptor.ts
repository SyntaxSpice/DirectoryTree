import {
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHandlerFn,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface CachedResponse {
  timestamp: number;
  body: any;
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  url: string;
}

const cacheKeyPrefix = 'http-cache:';
const cacheLifetime = 5 * 60 * 1000; // 5 minutes

function buildCacheKey(url: string): string {
  return `${cacheKeyPrefix}${url}`;
}

function getCachedResponse(key: string): HttpResponse<any> | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed: CachedResponse = JSON.parse(cached);
    const isExpired = Date.now() - parsed.timestamp > cacheLifetime;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return new HttpResponse({
      body: parsed.body,
      status: parsed.status,
      statusText: parsed.statusText,
      headers: new HttpHeaders(parsed.headers),
      url: parsed.url,
    });
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
}

function setCachedResponse(key: string, response: HttpResponse<any>): void {
  const headers: { [key: string]: string } = {};
  response.headers?.keys().forEach((name) => {
    headers[name] = response.headers.get(name) || '';
  });

  const entry: CachedResponse = {
    timestamp: Date.now(),
    body: response.body,
    status: response.status,
    statusText: response.statusText,
    headers,
    url: response.url || '',
  };

  localStorage.setItem(key, JSON.stringify(entry));
}

export function cacheInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheKey = buildCacheKey(req.urlWithParams);
  const cachedResponse = getCachedResponse(cacheKey);

  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        setCachedResponse(cacheKey, event);
      }
    })
  );
}
