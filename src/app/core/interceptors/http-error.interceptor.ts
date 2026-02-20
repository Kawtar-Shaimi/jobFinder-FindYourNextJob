import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

                if (error.status === 0) {
                    errorMessage = 'Impossible de se connecter au serveur. Vérifiez que JSON Server est lancé sur le port 3000.';
                } else if (error.status === 404) {
                    errorMessage = 'Ressource introuvable.';
                } else if (error.status === 500) {
                    errorMessage = 'Erreur interne du serveur.';
                }

                console.error('HTTP Error:', error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
