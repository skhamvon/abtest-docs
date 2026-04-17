# Modifications pour brancher la solution A/B sur `small-webserver`

Cette page recense, **côté dépôt `small-webserver`**, les ajouts et réglages qui permettent de faire tourner la **solution `abtest-solution`** (campagnes **frontend** et démo **backend**) dans le lab. L’objectif a été de rester **minimal** : pas de duplication du moteur dans ce dépôt, uniquement de l’**intégration** (config, routes, page de démo, robustesse dev).

Pour les **URLs** et la **démo backend**, voir aussi [Pages et URLs](./pages-and-urls.md) et [Développement et build](./development.md).

---

## Vue d’ensemble

| Axe                              | Rôle dans le lab                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** (Module Federation) | Le **host** charge un **remote** exposant `AbTestSlot`. En dev, **`apps/host/.env.development`** pointe par défaut vers le **`remoteEntry.js`** du remote **`abtest-solution`** (port **5001**, chemin sans préfixe `/remote/`). Le package **`@hackathon/abtest-remote`** (port **5101**, `base` **`/remote/`**) reste un **stub** utilisable en changeant **`VITE_ABTEST_REMOTE_URL`**. Les campagnes **`frontend`** passent par **`POST /api/evaluate`** (URL API côté remote : `VITE_ABTEST_API_URL`, défaut **5002**). |
| **Backend** (feature flags)      | Le **serveur Express** appelle **`POST /api/evaluate`** sur l’**API** `abtest-solution`, relaie les **query params de simulation** comme le remote officiel, et une **page React** affiche le résultat (`/demo/backend-abtest`).                                                                                                                                                                                                                                                                                            |

Prérequis habituels : API **`abtest-solution`** (`apps/api`, port **5002** par défaut) et données **`abtest-campaigns-segments`** à jour.

---

## Partie frontend (Module Federation)

### Configuration Vite du host

- **`apps/host/vite.config.ts`**
  - Remote **`abtest_remote`** : `entry` = `VITE_ABTEST_REMOTE_URL` ou, à défaut de variable, **`http://localhost:<VITE_ABTEST_REMOTE_PORT>/remote/remoteEntry.js`** (aligné sur le `base` **`/remote/`** du stub **`apps/abtest-remote`**).
  - **`server.proxy`** : préfixe **`/api`** → **`http://127.0.0.1:<PORT>`** (`PORT` du serveur Express, souvent **5000**) pour que les `fetch("/api/...")` depuis le host Vite atteignent le lab Node en dev.

### Fichiers d’environnement

- **`apps/host/.env.development`** — en pratique, URL du **`remoteEntry.js`** du remote **`abtest-solution`** (ex. **`http://localhost:5001/remoteEntry.js`**). Pour le lab **sans** `abtest-solution`, repointer vers **`http://localhost:5101/remote/remoteEntry.js`**.
- **`.env.example`** (racine) — rappel de **`VITE_ABTEST_REMOTE_URL`** et des variables **`ABTEST_*`** pour la démo backend.

### Composant hôte et résilience

- **`apps/host/src/components/AbTestRemoteSlot.tsx`** — `lazy()` vers **`abtest_remote/AbTestSlot`**, derrière **`OpenFeature`** (`enable_remote_abtest_shell`).
- **`apps/host/src/components/AbTestRemoteSlotErrorBoundary.tsx`** — si le **`remoteEntry.js`** est injoignable (mauvais port, remote arrêté), **erreur localisée** au lieu de faire planter toute l’application React.

### Confort dev

- **`apps/host/index.html`** — favicon en **data-URI** pour éviter un **404** systématique sur `favicon.ico`.

### Serveur Node (proxy dev)

- **`server/src/index.ts`** — compatibilité **`http-proxy-middleware` v3** (`on.proxyReq`) lorsque le build host n’existe pas encore et que le trafic est proxifié vers Vite.

---

## Partie backend (évaluation côté serveur)

### Route Express

- **`server/src/abtestBackendLab.ts`** (nouveau) — **`GET /api/lab/backend-abtest`** :

  - cookies de lab (`lab_abtest_user_id`, `lab_ab_assignment_<campaignId>`) ;
  - appel **`POST /api/evaluate`** vers **`ABTEST_API_URL`** (défaut `http://127.0.0.1:5002`) ;
  - relais des paramètres **`ab_campaign_id`**, **`ab_simulation`**, **`ab_force`**, **`ab_variation_id`**, **`ab_skip`** (même logique que le remote **`AbTestSlot`** d’`abtest-solution`) ;
  - réponse JSON pour la page démo (dont objet **`lab`** pour le debug).

- **`server/src/index.ts`** — enregistrement de la route **avant** le static et le proxy catch-all.

### Page et navigation host

- **`apps/host/src/pages/BackendAbtestDemoPage.tsx`** — démo **`/demo/backend-abtest`** : `fetch` avec **`location.search`**, affichage des **liens de simulation**, fond selon **`featureFlags`**.
- **`apps/host/src/App.tsx`** — route **`/demo/backend-abtest`**.
- **`apps/host/src/pages/HomePage.tsx`** — lien depuis l’accueil.

### Documentation utilisateur du lab

- **`README.md`** — section courte sur la démo backend et les variables d’environnement.

---

## Ce qui reste hors de `small-webserver`

- **Moteur, API, remote officiel, données** : dépôts **`abtest-solution`** et **`abtest-campaigns-segments`** (voir [Solution — introduction](../solution/intro.md) et [Module Federation & hôte](../solution/module-federation.md)).

---

## Voir aussi

- [Pages et URLs](./pages-and-urls.md) — routes `/demo/*`, ancre **Démo A/B backend**.
- [Développement et build](./development.md) — lancement conjoint API + lab.
- [Référence — ports et variables](../reference/ports-and-env.md#small-webserver).
- [Aperçu de l’API](../reference/api-overview.md) — `POST /api/evaluate`.
