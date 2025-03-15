import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <-- Add the imports for HttpClient
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import 'hammerjs';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()) // <-- Add this line to provide HttpClient globally
  ],
});


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideRouter } from '@angular/router';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';
// import 'hammerjs';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAnimations(),
//     provideRouter(routes)
//   ],
// });