# Ports et variables d’environnement

Vérifier `.env.example` de chaque dépôt si les défauts changent.

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

| Variable                      | Obligation | Description                                                                   |
| ----------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `ABTEST_CONSENT_COOKIE_NAME`  | optionnel  | Remplace le nom lu dans `consent-config.json` (chaîne non vide si surcharge). |
| `ABTEST_CONSENT_COOKIE_VALUE` | optionnel  | Remplace la valeur attendue ; comparaison stricte avec `context.cookies`.     |

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

`npm run docs:dev` affiche l’URL (souvent port 5173 — peut entrer en conflit avec le host du labo).

---

## Réseau d’entreprise

Proxy, registry npm interne ou certificats si `npm install` échoue (SSL, 403).
