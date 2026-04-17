# Module Federation et intégration hôte

## Objectif

Permettre à un **site hôte** (React, autre stack, bundler Vite/Webpack) de :

1. Charger le **remote** déployé depuis `abtest-solution` (`apps/remote`).
2. Appeler **`/api/evaluate`** avec un contexte (cookies, URL, etc.).
3. Afficher la **variante** (JS/CSS/composants) retournée par le moteur.

Ce flux correspond aux campagnes **`type: frontend`** (livraison par assets). Pour les campagnes **`type: backend`**, la variante s’applique **côté serveur** : le hôte appelle **`POST /api/evaluate`** depuis **sa stack serveur** (ou BFF), consomme notamment **`variation.featureFlags`**, et ne passe **pas** par le slot Module Federation pour la décision (voir [Campagnes — intégration backend](./campaigns-segments/campaigns.md#intégration-backend-feature-flags)).

## Étapes

1. **Build** du workspace `apps/remote` et hébergement statique (CDN, bucket, etc.).
2. **Déclarer** le remote dans la config Module Federation du hôte (URL du `remoteEntry` selon build).
3. **Importer** au runtime les modules exposés (composant, hooks, etc., selon l’API du remote).

Le dépôt **`small-webserver`** illustre une chaîne complète en labo.

## Paramètres d’URL (remote `AbTestSlot`)

Le composant exposé lit notamment :

| Paramètre         | Description                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (assets communs)  | Si le `config.json` de la campagne définit **`sharedJsPath`** / **`sharedCssPath`**, le remote les injecte **avant** les `jsPath` / `cssPath` de la variante choisie. |
| `ab_campaign_id`  | **Nombre** (id campagne 10000–99999).                                                                                                                                 |
| `ab_simulation=1` | Mode simulation côté API (`simulation` non nul) : campagne inactive, hors segment ou sans consentement « mesure » peuvent quand même servir une variante.             |
| `ab_force=1`      | Alias de `ab_simulation=1` (même effet).                                                                                                                              |
| `ab_variation_id` | Optionnel : **nombre** (id de variation) pour forcer une variante (souvent avec simulation).                                                                          |
| `ab_skip=1`       | N’appelle pas `/api/evaluate` et n’injecte aucun asset : le test ne se charge pas pour cette page.                                                                    |

## Props du composant `AbTestSlot`

| Prop                   | Rôle                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `navigationDependency` | Optionnel : chaîne qui change quand la vue SPA change sans URL (ex. `location.key` React Router). |

Variable d’environnement côté build : `VITE_ABTEST_API_URL` (sinon `http://localhost:5002` par défaut en dev).

## Contexte navigateur

Le remote alimente notamment :

| Champ dans `context` | Rôle                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `cookies`            | Objet clé → valeur ; consentement (`consent-config`) et règles segment `cookie`.                                     |
| `visitorType`        | `new` \| `returning` (souvent via cookie démo `abtest_returning`).                                                   |
| `userId`             | Identifiant stable par navigateur (remote : `localStorage` + cookie miroir `abtest_vid`), utilisé pour le bucketing. |

**Géo** (`country`, `region`, `city`) : en général injectée par **BFF**, **edge** ou **CDN**, pas uniquement par le navigateur — voir [Règles et contexte](./campaigns-segments/segments.md#contexte-usercontext).

Voir [Segments](./campaigns-segments/segments.md), [Consentement](./consent.md) et [Visiteur et assignations](./visitor-assignments.md) (sticky, SPA, module fédéré `./visitorId`).
