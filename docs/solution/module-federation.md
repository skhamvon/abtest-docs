# Module Federation et intégration hôte

## Objectif

Permettre à un **site hôte** (React, autre stack, bundler Vite/Webpack) de :

1. Charger le **remote** déployé depuis `abtest-solution` (`apps/remote`).
2. Appeler **`/api/evaluate`** avec un contexte (cookies, URL, etc.).
3. Afficher la **variante** (JS/CSS/composants) retournée par le moteur.

## Étapes

1. **Build** du workspace `apps/remote` et hébergement statique (CDN, bucket, etc.).
2. **Déclarer** le remote dans la config Module Federation du hôte (URL du `remoteEntry` selon build).
3. **Importer** au runtime les modules exposés (composant, hooks, etc., selon l’API du remote).

Le dépôt **`small-webserver`** illustre une chaîne complète en labo.

## Paramètres d’URL (remote `AbTestSlot`)

Le composant exposé lit notamment :

| Paramètre         | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `ab_campaign_id`  | **Nombre** (id campagne 10000–99999).                                      |
| `ab_simulation=1` | Active un mode simulation côté API (objet `simulation` non nul).           |
| `ab_variation_id` | Optionnel : **nombre** (id de variation) pour forcer une variante en démo. |

Variable d’environnement côté build : `VITE_ABTEST_API_URL` (sinon `http://localhost:5002` par défaut en dev).

## Contexte navigateur

Le remote alimente notamment :

| Champ dans `context` | Rôle                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| `cookies`            | Objet clé → valeur ; consentement (`consent-config`) et règles segment `cookie`. |
| `visitorType`        | `new` \| `returning` (souvent via cookie démo `abtest_returning`).               |

**Géo** (`country`, `region`, `city`) : en général injectée par **BFF**, **edge** ou **CDN**, pas uniquement par le navigateur — voir [Règles et contexte](./campaigns-segments/segments.md#contexte-usercontext).

Voir [Segments](./campaigns-segments/segments.md) et [Consentement](./consent.md).
