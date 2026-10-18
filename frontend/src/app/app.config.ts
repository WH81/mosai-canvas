import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling, // <-- 1. Import this
} from '@angular/router';

import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';

import { authInterceptor } from './admin/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    // 2. Add withInMemoryScrolling here
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    provideClientHydration(
      withEventReplay()
    ),

    /**
     * Configure Angular HttpClient and register
     * the authentication interceptor.
     */
    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ])
    ),
  ],
};