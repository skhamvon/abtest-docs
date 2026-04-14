# Visiteur, sticky et persistance des assignations

Ce document décrit le comportement du **remote** (`apps/remote`) et son lien avec `POST /api/evaluate`.

## Identifiant visiteur (`context.userId`)

Le remote remplit **`userId`** dans le contexte envoyé au moteur :

- **Clé `localStorage`** : `abtest_visitor_id`
- **Cookie miroir** : `abtest_vid` (first-party, `path=/`, `SameSite=Lax`, longue durée)

À la première visite, un UUID est généré puis réutilisé. Le moteur s’en sert pour le **bucketing** (`seed = campaignId:userId`) lorsqu’aucune variation sticky n’applique.

### Remplacer l’id après login

Le module fédéré expose aussi **`./visitorId`** avec `setAbtestVisitorId(id)` (à appeler **tôt**, id unique, max 255 caractères). Changer d’id **après** une première assignation peut modifier le bucket si le sticky n’est plus présent ; en pratique le **sticky par campagne** reste prioritaire tant qu’il est valide.

## Stockage des assignations (sticky)

- **Source principale** : `localStorage`, clé **`abtest_assignments_v1`**, objet JSON `{ "v": 1, "entries": { "<campaignId>": { "variationId", "expiresAtMs" } } }`.
- **TTL** : aligné sur `campaign.endDate` si défini et futur, sinon **30 jours** (même ordre de grandeur que l’ancien cookie).
- **Migration** : si une entrée est absente ou expirée, le remote relit l’ancien cookie **`ab_var_<campaignId>`**, l’importe dans le store puis **supprime** ce cookie pour éviter deux sources de vérité.
- **Mode `technical`** : aucune écriture dans le store (équivalent à l’absence d’ancien cookie d’assignation).
- **`consent_required`** (mesure sans consentement) : l’entrée campagne est **supprimée** du store et tout cookie `ab_var_*` restant est effacé.

## File d’attente d’évaluation

Les appels `fetch` + injection d’assets passent par une **file sérialisée** côté remote pour limiter les courses au chargement (Module Federation, ordre des effets).

## SPA et ré-évaluation

- Le composant **`AbTestSlot`** réagit aux changements de **`pathname` + `search`** (y compris via `history.pushState` / `replaceState` patché une fois par onglet).
- Prop optionnelle **`navigationDependency`** : à lier par exemple à **`location.key`** (React Router) quand l’URL ne change pas mais que la vue métier change, pour forcer une nouvelle évaluation.

## API : diagnostics

La réponse de `POST /api/evaluate` inclut un objet **`diagnostics`** :

- **`hadAssignedVariationInRequest`** : `true` si `context.assignedVariationId` était un entier valide dans la requête.
- **`resolvedBySticky`** : `true` si la raison moteur est `by_sticky_assignment`.

Voir [Aperçu de l’API](../reference/api-overview.md) pour la liste des valeurs de **`reason`**.

## Références

- [Module Federation et intégration hôte](./module-federation.md)
- [Consentement](./consent.md)
