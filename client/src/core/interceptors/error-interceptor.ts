import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError(er => {
      if (er) {
        switch (er.status) {
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: er.error } }
            router.navigateByUrl('/server-error', navigationExtras)
            break;
          case 400:
            if (er.error.errors) {
              const modelStateErrors = [];
              for (const key in er.error.errors) {
                if (er.error.errors[key]) {
                  modelStateErrors.push(er.error.errors[key])
                }
              }
              throw modelStateErrors.flat()
            }
            else {
              toast.error(er.error);
            }
            break;
          case 401:
            toast.error('Unauthorized');
            break;
          case 404:
            router.navigateByUrl('/not-found')
            break;
          default:
            toast.error('Something went wrong');
            break;
        }
      }
      throw er;
    })
  )
};
