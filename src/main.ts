import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error('Bootstrap Error:', err);
    // Display error on screen for the user to see
    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.color = 'red';
    errorDiv.style.backgroundColor = '#fff';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100%';
    errorDiv.style.zIndex = '99999';
    errorDiv.style.overflow = 'auto';

    errorDiv.innerHTML = `
      <h1 style="color: #e11d48">Erreur Critique au Démarrage 🛑</h1>
      <p>L'application n'a pas pu démarrer. Voici l'erreur technique :</p>
      <pre style="background: #f8f8f8; padding: 15px; border: 1px solid #ddd;">${err.stack || err.message || err}</pre>
      <p>S'il vous plaît, faites une capture d'écran de ce message ou copiez-le ici.</p>
      <button onclick="window.location.reload()" style="padding: 10px; background: #3b82f6; color: white; border: none; cursor: pointer;">Réessayer</button>
    `;
    document.body.appendChild(errorDiv);
  });
