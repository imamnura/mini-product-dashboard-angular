import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const httpTimingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Date.now() - started;
        console.log(`✅ ${req.method} ${req.url} - ${elapsed}ms`);
      },
      error: () => {
        const elapsed = Date.now() - started;
        console.error(`❌ ${req.method} ${req.url} - ${elapsed}ms`);
      },
    })
  );
};
