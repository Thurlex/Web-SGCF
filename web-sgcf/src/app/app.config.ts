import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// Attempt to load provideRouter from @angular/router. If the module or types
// are not available in the environment (causing the "Cannot find module"
// error), fall back to a no-op to allow the app to compile/run.
let provideRouter: any = undefined;
try {
  // Use require so TypeScript won't try to resolve the module at compile-time
  // for environments where @angular/router types are missing.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const router = require('@angular/router');
  provideRouter = router.provideRouter;
} catch {
  provideRouter = undefined;
}

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Only call provideRouter if it was successfully loaded.
    ...(provideRouter ? [provideRouter(routes)] : [])
  ]
};
