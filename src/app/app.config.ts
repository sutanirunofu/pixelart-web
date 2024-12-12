import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from "@angular/core";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { routes } from "./app.routes";
import { HttpInterceptor } from "./shared/interceptors/http.interceptor";
import * as fromStoreReference from "./store";

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptor,
            multi: true,
        },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(),
        provideStore(fromStoreReference.reducers, {
            runtimeChecks: {
                strictStateImmutability: false,
            },
            metaReducers: fromStoreReference.metaReducers,
        }),
        provideEffects(),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        provideEffects(fromStoreReference.effects),
        provideAnimations(),
    ],
};
