# Architecture de la solution

Le dépôt **`abtest-solution`** contient la solution d’A/B testing : moteur de décision, API, interface d’administration et remote / module fédéré consommable par un site hôte (par exemple le dépôt `small-webserver` dans le hackathon).

## Structure principale

- `apps/api` : service Node/Express qui expose l’API HTTP (CRUD campagnes/segments, `/api/evaluate`), basée sur les fichiers du dépôt `abtest-campaigns-segments`.
- `apps/remote` : remote / module fédéré, chargé par le site hôte pour afficher les variations et intégrer la logique A/B.
- `apps/ui` : interface d’administration (React) pour gérer campagnes et segments.
- `packages/core` : moteur cœur (modèle de données, bucketing, ports « storage » / « tracking »).
- `packages/storage-fs` : adaptateur de stockage fichier, branché sur le dépôt `abtest-campaigns-segments`.
- `abtest-campaigns-segments` : **submodule Git** contenant les campagnes et segments (JSON, JS, CSS).

## Prérequis

- Node.js **20+** (avec `npm`).
- Avoir cloné le dépôt parent `hackathon-abtest` avec ses submodules, ou avoir initialisé `abtest-solution` avec son submodule `abtest-campaigns-segments`.

Depuis la racine de `abtest-solution` :

```bash
npm install
```

Si besoin, copie le fichier d’exemple d’environnement (s’il existe) et adapte les valeurs :

```bash
cp .env.example .env   # si présent
```

## Variables d’environnement utiles (ports)

Pour faciliter les démos (locales ou en conteneur), les ports des services principaux sont configurables via variables d’environnement :

- **API** (`apps/api`) :

  - Variable : `PORT`
  - Défaut : `5002`
  - Exemple : `PORT=8080 npm run dev --workspace apps/api`

- **UI d’administration** (`apps/ui`) :

  - Variable : `VITE_UI_PORT`
  - Défaut : `5174`
  - Exemple : `VITE_UI_PORT=3001 npm run dev --workspace apps/ui`

- **Remote / module fédéré** (`apps/remote`) :
  - Variable : `VITE_REMOTE_PORT`
  - Défaut : `5001`
  - Exemple : `VITE_REMOTE_PORT=5100 npm run dev --workspace apps/remote`

En l’absence de ces variables, les valeurs par défaut sont utilisées. Pour une démo derrière une URL du type `http://monhost:xxxx`, il est souvent suffisant d’exposer le port interne choisi (`PORT`, `VITE_UI_PORT`, etc.) avec un mapping de port Docker ou un reverse proxy, sans modifier le code.

Pour le détail du submodule campagnes et des commandes `git submodule`, voir [Développement](development.md) et [Données campagnes & segments](campaigns-data.md).
