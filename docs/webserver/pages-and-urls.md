# Pages et URLs (small-webserver)

Pour l’**inventaire des modifications** du dépôt `small-webserver` liées à **`abtest-solution`** (front MF + démo backend), voir [Intégration abtest-solution — modifs lab](./abtest-solution-changes.md).

## Application host (React, Vite)

Port par défaut **5173** (`VITE_HOST_PORT`).

| Route                                | Description                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `http://localhost:<VITE_HOST_PORT>/` | Accueil — liens vers les démos.                                                                                      |
| `.../demo/fast`                      | Démo légère.                                                                                                         |
| `.../demo/heavy`                     | Démo plus lourde (lazy loading).                                                                                     |
| `.../demo/backend-abtest`            | Lab **A/B backend** : le serveur Node appelle l’API d’évaluation et renvoie des **feature flags** (voir ci-dessous). |

### Démo A/B backend (lab) {#demo-ab-backend-lab}

- **Page :** `http://localhost:<VITE_HOST_PORT>/demo/backend-abtest` (même route en preview via le serveur Node après `npm run build && npm start`).
- **Route API (Express) :** `GET /api/lab/backend-abtest` — le serveur du monorepo `small-webserver` appelle **`POST /api/evaluate`** sur **`abtest-solution`** (`ABTEST_API_URL`, défaut `http://127.0.0.1:5002`), lit `variation.featureFlags`, pose des cookies de lab (`lab_abtest_user_id`, `lab_ab_assignment_<campaignId>`), et renvoie un JSON au navigateur.
- **Variables d’environnement** (racine `small-webserver`, voir `.env.example`) : `ABTEST_API_URL`, `ABTEST_BACKEND_DEMO_CAMPAIGN_ID` (défaut **10003** — campagne **`DemoBackendCampaign`** dans `abtest-campaigns-segments`).
- **Prérequis :** l’API **`apps/api`** de `abtest-solution` doit tourner avec les données de campagne à jour ; sinon la route renvoie un JSON de repli (`ok: false`, raison `api_unavailable` ou erreur HTTP).
- **Développement (`npm run dev`) :** le host Vite proxifie le préfixe **`/api`** vers **`http://127.0.0.1:<PORT>`** (`PORT` du serveur Node, souvent **5000**) pour que le `fetch("/api/...")` depuis le navigateur atteigne Express.
- **Simulation (comme le remote front) :** la page reprend la **query string** et l’envoie au `GET /api/lab/backend-abtest` ; le serveur relaie vers **`POST /api/evaluate`** les mêmes conventions que **`AbTestSlot`** : `ab_simulation=1` ou `ab_force=1`, `ab_variation_id`, `ab_skip=1`, optionnel `ab_campaign_id` (sinon id d’env **`ABTEST_BACKEND_DEMO_CAMPAIGN_ID`**). La page affiche des liens d’exemple (simulation seule, forçage contrôle / variante).

## Clone statique OVHcloud (`/ovh-bare-metal/`)

| Accès                                               | Description                                                 |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `http://localhost:<VITE_HOST_PORT>/ovh-bare-metal/` | Via Vite — HMR, même origine que le host.                   |
| `http://127.0.0.1:<PORT>/ovh-bare-metal/`           | Via serveur Node — `PORT` souvent `5000`, throttle Express. |

**Prérequis :** `apps/host/public/ovh-bare-metal` rempli (snapshot).

### Régénérer le snapshot (usage test / respecter les CGU du site source)

```bash
mkdir -p apps/host/public/ovh-bare-metal
wget -E -H -k -p -nd -P apps/host/public/ovh-bare-metal \
  "https://www.ovhcloud.com/fr/bare-metal/"
npm run fix:ovh
```

Puis `npm run build -w @hackathon/host` si besoin.

## Ressources dans le dépôt

- `apps/host/public/feature-flags.json`
- `apps/host/vite.config.ts`, `apps/abtest-remote/vite.config.ts`
- `apps/host/vite-plugin-ovh-static.ts`
