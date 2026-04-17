# Ports et variables d’environnement

Vérifier `.env.example` de chaque dépôt si les défauts changent.

## Cartographie locale (développement)

Quand tout tourne en parallèle (`npm run dev` à la racine du hackathon + doc), les **ports par défaut** ci‑dessous sont choisis pour **ne pas se marcher dessus** (notamment doc **5175** vs host lab **5173**).

| Port     | Service                                                               | Dépôt / commande                                  | Variable                                 |
| -------- | --------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| **5000** | Serveur Express unifié (throttle, `/api` lab, static)                 | `small-webserver` — workspace `@hackathon/server` | `PORT`                                   |
| **5001** | Dev server du **remote** réel (assets campagnes `jsPath` / `cssPath`) | `abtest-solution` — `apps/remote`                 | `VITE_REMOTE_PORT`                       |
| **5002** | API Express (CRUD, `/api/evaluate`, …)                                | `abtest-solution` — `apps/api`                    | `PORT`                                   |
| **5101** | Remote Module Federation **minimal du labo**                          | `small-webserver` — `apps/abtest-remote`          | `VITE_ABTEST_REMOTE_PORT`                |
| **5173** | Host React + HMR (démos lab)                                          | `small-webserver` — `apps/host`                   | `VITE_HOST_PORT`                         |
| **5174** | UI d’administration A/B                                               | `abtest-solution` — `apps/ui`                     | `VITE_UI_PORT`                           |
| **5175** | Documentation VitePress                                               | `abtest-docs` — `npm run docs:dev`                | fixé dans `package.json` (`--port 5175`) |

Les campagnes **frontend** en dev pointent les assets vers le remote **solution** (`http://localhost:5001/...`), pas vers le port **5101** du labo.

---

## abtest-solution

| Variable           | Défaut / forme                  | Usage                                 |
| ------------------ | ------------------------------- | ------------------------------------- |
| `PORT` (API)       | Entier 1–65535 ; souvent `5002` | Port HTTP de `apps/api`.              |
| `VITE_UI_PORT`     | Entier ; souvent `5174`         | Dev server de `apps/ui`.              |
| `VITE_REMOTE_PORT` | Entier ; souvent `5001`         | Dev server du remote (`apps/remote`). |

Exemples :

```bash
PORT=8080 npm run dev --workspace apps/api
VITE_UI_PORT=3001 npm run dev --workspace apps/ui
VITE_REMOTE_PORT=5100 npm run dev --workspace apps/remote
```

### Consentement (API) {#consentement-api}

| Variable                       | Obligation | Description                                                                                         |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| `ABTEST_CONSENT_COOKIE_NAME`   | optionnel  | Remplace le nom lu dans `consent-config.json` (chaîne non vide si surcharge).                       |
| `ABTEST_CONSENT_COOKIE_VALUE`  | optionnel  | Remplace la valeur attendue ; comparaison stricte avec `context.cookies`.                           |
| `ABTEST_CONSENT_COOKIE_DOMAIN` | optionnel  | Remplace le champ racine **`domain`** lu dans `consent-config.json` (chaîne non vide si surcharge). |

Voir [Consentement](../solution/consent.md).

---

## small-webserver {#small-webserver}

| Variable                  | Défaut / forme                     | Usage                                         |
| ------------------------- | ---------------------------------- | --------------------------------------------- |
| `PORT`                    | Entier ; souvent `5000`            | Serveur Express unifié.                       |
| `VITE_HOST_PORT`          | Entier ; souvent `5173`            | Host Vite en dev.                             |
| `VITE_ABTEST_REMOTE_PORT` | Entier ; souvent `5101`            | Remote Module Federation du **labo**.         |
| `THROTTLE_KBPS`           | Nombre ≥ `0` ; `0` = pas de limite | Plafond débit sortant du serveur Node (ko/s). |

Fichiers : `.env` et `.env.local` à la racine de `small-webserver` (`.local` écrase).

Autres clés : [.env.example du dépôt](https://github.com/skhamvon/small-webserver/blob/main/.env.example).

---

## abtest-docs

`npm run docs:dev` utilise le port **5175** par défaut (`package.json`), pour éviter le conflit avec le host Vite du labo (**5173**). Pour un autre port : `vitepress dev docs --port <n>`.

---

## Réseau d’entreprise

Proxy, registry npm interne ou certificats si `npm install` échoue (SSL, 403).
