# Aperçu de l’API (abtest-solution)

Service **`apps/api`** (Express). Chemins exacts dans `server.ts` du dépôt.

## Principaux endpoints

| Endpoint                                                                        | Corps / usage                                                                                                                        | Réponse (idée)                                                                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/evaluate`                                                            | `campaignId` (**nombre** 10000–99999), `context`, optionnel `simulation` (`variationId` **nombre**).                                 | Variante assignée, `reason`, `matchedSegmentIds`, `campaignSegments`, **`diagnostics`** (`hadAssignedVariationInRequest`, `resolvedBySticky`). |
| `POST /api/evaluate/segment-diagnostics`                                        | `campaignId`, `context`, **`simulation` obligatoire** (objet JSON, peut être `{}`). Réservé au mode lab / diagnostic (ex. UI admin). | Par segment rattaché à la campagne : `id`, `name`, `matches`, `breakdown` (arbre critère attendu / valeur actuelle, aligné sur le moteur).     |
| `GET /api/consent-config`                                                       | —                                                                                                                                    | Garde-fou actif ou non, nom / valeur de cookie attendus (CMP, bandeau).                                                                        |
| `GET` / `POST` / `PUT` / `DELETE`… sous `/api/campaigns`, `/api/segments`, etc. | Selon route                                                                                                                          | Utilisés par l’UI ; persistance fichiers via `storage-fs`.                                                                                     |

## `POST /api/evaluate` — champ `reason`

Valeurs possibles (moteur `packages/core`) : `by_bucket`, `by_sticky_assignment`, `forced_simulation`, `campaign_not_running`, `no_matching_segment`, `no_variation`, `consent_required`.

## `POST /api/evaluate` — champ `diagnostics`

- `hadAssignedVariationInRequest` : `true` si `context.assignedVariationId` était un entier valide dans la requête.
- `resolvedBySticky` : `true` si `reason` vaut `by_sticky_assignment`.

## Stockage

Racine des fichiers = dépôt **`abtest-campaigns-segments`** (montage selon config de déploiement).

Code : [apps/api/src/server.ts](https://github.com/skhamvon/abtest-solution/blob/main/apps/api/src/server.ts).
