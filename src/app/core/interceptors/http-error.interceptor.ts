import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

            if (error.status === 0) {
                errorMessage = 'Impossible de se connecter au serveur. Vérifiez que JSON Server est lancé sur le port 3000.';
            } else if (error.status === 404) {
                errorMessage = 'Ressource introuvable.';
            } else if (error.status === 500) {
                errorMessage = 'Erreur interne du serveur.';
            }

            console.error('HTTP Error:', error.status, error.message);
            return throwError(() => new Error(errorMessage));
        })
    );
};
