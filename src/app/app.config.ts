import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronRight } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([cacheInterceptor])),
    provideRouter(routes),
    provideIcons({ heroChevronDown, heroChevronRight }),
  ],
};
