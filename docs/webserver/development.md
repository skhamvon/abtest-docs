# Développement et build (small-webserver)

## Mode développement

```bash
npm run dev
```

Lance en parallèle remote (~5101), host Vite (~5173), serveur Express (~5000 selon `.env`).

Pour la **[démo A/B backend](./pages-and-urls.md#demo-ab-backend-lab)** : lance aussi l’API **`abtest-solution`** (`apps/api`, port **5002** par défaut) et vérifie les variables **`ABTEST_API_URL`** / **`ABTEST_BACKEND_DEMO_CAMPAIGN_ID`** dans le `.env` du `small-webserver` si besoin. En dev, les requêtes **`/api/*`** du navigateur passent par le **proxy Vite** du host vers le serveur Node (voir `apps/host/vite.config.ts`).

| Mode                                  | URL typique                          |
| ------------------------------------- | ------------------------------------ |
| React + HMR (host Vite)               | `http://localhost:<VITE_HOST_PORT>/` |
| Serveur unifié (throttle + statiques) | `http://127.0.0.1:<PORT>/`           |

## Build et prod locale

```bash
npm run build
npm start
```

## Scripts npm

| Script            | Rôle                                               |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Remote + host + server (ports selon `.env`).       |
| `npm run build`   | Écrit les `dist` des workspaces.                   |
| `npm start`       | Après `build` — serveur Node de prod.              |
| `npm run preview` | Enchaîne `build` + `start`.                        |
| `npm run fix:ovh` | Après `wget` du clone OVH — normalise HTML / noms. |

## Voir aussi

- [Introduction](./intro.md)
- [Throttle](./network-throttle.md)
