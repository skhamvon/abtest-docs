# Aperçu de l’API (abtest-solution)

Service **`apps/api`** (Express). Chemins exacts dans `server.ts` du dépôt.

## Principaux endpoints

| Endpoint                                                                        | Corps / usage                                                                                                                        | Réponse (idée)                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/evaluate`                                                            | `campaignId` (**nombre** 10000–99999), `context`, optionnel `simulation` (`variationId` **nombre**).                                 | Objet **`campaign`**, **`variation`** (tel que la config : champs `id`, `name`, `trafficAllocation`, chemins d’assets si front, **`featureFlags`** optionnel pour le **backend** / BFF), `reason`, `matchedSegmentIds`, `campaignSegments`, **`diagnostics`** (`hadAssignedVariationInRequest`, `resolvedBySticky`). |
| `POST /api/evaluate/segment-diagnostics`                                        | `campaignId`, `context`, **`simulation` obligatoire** (objet JSON, peut être `{}`). Réservé au mode lab / diagnostic (ex. UI admin). | Par segment rattaché à la campagne : `id`, `name`, `matches`, `breakdown` (arbre critère attendu / valeur actuelle, aligné sur le moteur).                                                                                                                                                                           |
| `GET /api/consent-config`                                                       | —                                                                                                                                    | `stored` / `effective` : **domain** (site), cookie `name`/`value`, garde-fou, `envOverrides`.                                                                                                                                                                                                                        |
| `PUT /api/consent-config`                                                       | **`domain`** (obligatoire, non vide), **`acceptanceCookie`** `{ name, value }`                                                       | Écrit `consent-config.json` ; réponse alignée sur `GET`.                                                                                                                                                                                                                                                             |
| `GET` / `POST` / `PUT` / `DELETE`… sous `/api/campaigns`, `/api/segments`, etc. | Selon route                                                                                                                          | Utilisés par l’UI ; persistance fichiers via `storage-fs`.                                                                                                                                                                                                                                                           |

## `POST /api/evaluate` — objet `variation`

L’API renvoie la **variation choisie** telle que chargée depuis le stockage (fichiers sous **`abtest-campaigns-segments`**). Les champs **`jsPath`** / **`cssPath`** / chemins **`shared*`** concernent surtout les campagnes **`frontend`**. Pour une campagne **`backend`**, l’intégration attendue côté hôte est de consommer notamment **`variation.featureFlags`** (objet `string → boolean` défini dans le `config.json` de la campagne) après l’appel serveur à **`/api/evaluate`**.

## `POST /api/evaluate` — champ `reason`

Valeurs possibles (moteur `packages/core`) : `by_bucket`, `by_sticky_assignment`, `forced_simulation`, `campaign_not_running`, `no_matching_segment`, `no_variation`, `consent_required`.

## `POST /api/evaluate` — champ `diagnostics`

- `hadAssignedVariationInRequest` : `true` si `context.assignedVariationId` était un entier valide dans la requête.
- `resolvedBySticky` : `true` si `reason` vaut `by_sticky_assignment`.

## Stockage

Racine des fichiers = dépôt **`abtest-campaigns-segments`** (montage selon config de déploiement).

Code : [apps/api/src/server.ts](https://github.com/skhamvon/abtest-solution/blob/main/apps/api/src/server.ts).
