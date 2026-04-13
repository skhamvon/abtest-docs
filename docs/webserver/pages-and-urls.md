# Pages et URLs (small-webserver)

## Application host (React, Vite)

Port par défaut **5173** (`VITE_HOST_PORT`).

| Route                                | Description                      |
| ------------------------------------ | -------------------------------- |
| `http://localhost:<VITE_HOST_PORT>/` | Accueil — liens vers les démos.  |
| `.../demo/fast`                      | Démo légère.                     |
| `.../demo/heavy`                     | Démo plus lourde (lazy loading). |

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
