# JobFinder Angular SPA

> Application de recherche d'emploi permettant de consulter des offres via des APIs publiques, sauvegarder des favoris et suivre ses candidatures.

## Technologies

- **Angular 17** (Standalone components)
- **NgRx** (Store, Effects, Entity, DevTools) pour la gestion des favoris
- **JSON Server** pour simuler le backend REST
- **RxJS / Observables**
- **Reactive Forms**
- **Bootstrap** pour le responsive design
- **TypeScript**

## Lancement du projet

### Prérequis
- Node.js v18+
- Angular CLI v17+

### Installation
```bash
npm install
```

### Lancer JSON Server (dans un terminal)
```bash
npm run server
```

### Lancer l'application Angular (dans un autre terminal)
```bash
npm start
```

L'application est disponible sur `http://localhost:4200`
JSON Server tourne sur `http://localhost:3000`

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Services (Auth, Jobs, Favorites, Applications)
│   │   ├── guards/          # AuthGuard
│   │   └── interceptors/    # HTTP interceptors
│   ├── features/
│   │   ├── auth/            # Login / Register
│   │   ├── home/            # Recherche d'emploi
│   │   ├── favorites/       # Favoris (NgRx)
│   │   ├── applications/    # Suivi des candidatures
│   │   └── profile/         # Profil utilisateur
│   ├── shared/
│   │   └── components/      # Navbar, JobCard, Spinner, Pagination
│   └── store/               # NgRx state (favorites)
├── assets/
└── environments/
```

## Fonctionnalités

- **Authentification** : Inscription / Connexion avec sessionStorage
- **Recherche d'emplois** : Filtrage par mot-clé (dans le titre) et localisation, tri par date
- **Pagination** : 10 résultats par page
- **Favoris** : Ajout / suppression via NgRx Store
- **Candidatures** : Suivi avec statuts (en_attente / accepté / refusé) et notes
- **Profil** : Modification des informations personnelles et suppression de compte
- **AuthGuard** : Protection des routes privées
- **Lazy Loading** : Chargement différé des modules
- **Responsive** : Mobile-first avec Bootstrap

## Compte démo
- Email : `demo@jobfinder.com`
- Mot de passe : `Demo1234`

## Contribution

Toutes les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`).
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`).
4. Pushez vers la branche (`git push origin feature/AmazingFeature`).
5. Ouvrez une Pull Request.
