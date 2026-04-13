# Limitation de débit (throttle)

Serveur Node (`server`), port par défaut **`PORT=5000`**.

## Variable principale

| Variable        | Forme                                  | Effet                                                                    |
| --------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `THROTTLE_KBPS` | Nombre ≥ `0` ; **`0`** = pas de limite | Plafond en **kilo-octets par seconde** sur les réponses du serveur Node. |

## Ordres de grandeur indicatifs

| Scénario indicatif | Ordre de grandeur `THROTTLE_KBPS` |
| ------------------ | --------------------------------- |
| 2G / EDGE          | ≈ 15–40                           |
| 3G                 | ≈ 100–300 (souvent 200–250)       |
| 4G LTE             | ≈ 1500–4000                       |
| 5G / illimité      | 8000+ ou `0` (pas de limite)      |
| ADSL               | ≈ 400–1000                        |
| VDSL / fibre       | ≈ 3000–6000                       |

## Configuration

1. `.env` à la racine de `small-webserver` (voir `.env.example`).
2. `.env.local` écrase `.env` (hors Git).
3. Redémarrer le serveur après modification.

## Throttle à chaud (dev uniquement)

`GET` / `POST` **`/__dev/throttle`** — désactivé si `NODE_ENV=production`.

```bash
curl -s -X POST "http://127.0.0.1:5000/__dev/throttle" \
  -H "Content-Type: application/json" \
  -d '{"throttleKbps": 50}'
```

Remplacer **5000** par votre `PORT`.

## Remarques

- **Vite direct (5173)** : throttle aussi via plugin dev ; redémarrer le host après changement `.env`.
- **Passage par Express** : throttle côté Node uniquement pour éviter le double ralentissement.
- **Remote labo** : le JS chargé depuis le port du remote n’est pas limité par le throttle du host par défaut.

Implémentation : `server/src/throttle.ts`.
