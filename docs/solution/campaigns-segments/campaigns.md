# Campagnes

## Deux axes à ne pas confondre

Une campagne combine :

1. **Mode de livraison** — champ **`type`** : comment la variante est appliquée techniquement.
2. **Confidentialité / mesure** — champ **`privacyMode`** : impact **consentement**, **tracking** et **cookie d’assignation**.

**Valeurs possibles des axes (rappel) :**

- **`type`** (livraison) : `frontend` \| `backend`
- **`privacyMode`** (confidentialité) : `measurement` (défaut si le champ est absent) \| `technical`

| Combinaison          | Avec `privacyMode: measurement`                                                                                                                                                                         | Avec `privacyMode: technical`                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`type: frontend`** | **Description :** variante avec assets JS/CSS (URLs). **Comportement :** soumise au **cookie d’acceptation** si `consent-config` actif ; tracking et cookie d’assignation possibles si consentement OK. | **Description :** même livraison front. **Comportement :** pas d’exigence de consentement analytics ; **pas** de tracking ni de cookie d’assignation. |
| **`type: backend`**  | **Description :** variante côté serveur / logique non front (selon implémentation). **Comportement :** mêmes règles consentement / tracking que la ligne front en measurement.                          | **Description :** idem côté livraison backend. **Comportement :** pas de tracking pour cette campagne.                                                |

Pour le détail du consentement : [Consentement](../consent.md).

## Arborescence dans le dépôt

Sous **`abtest-campaigns-segments/Campaigns/`**, une campagne est en général un dossier du type :

```text
Campaigns/
  MaCampagne/
    config.json
    shared/
      script.js
      style.css
    variant-1/
      script.js
      style.css
    variant-2/
      script.js
      style.css
```

### Convention des dossiers d’assets : `variant-x`

Pour une campagne **`frontend`**, les fichiers statiques (souvent **`script.js`** et **`style.css`**) sont rangés dans des sous-dossiers nommés **`variant-1`**, **`variant-2`**, … — le **chiffre** suit l’**emplacement** de la variante dans le moteur (emplacement **1** → dossier **`variant-1`**, etc.). La **contrôle** (emplacement **0**) n’a en général **pas** de dossier dédié, sauf besoin explicite.

Cette convention **numérique** est préférable aux noms libres du type `variant-a`, `patch-a` ou `variant-red` : elle reste alignée avec les **ids numériques** des variations (`idCampagne × 10 + emplacement`) et avec la [CLI scaffold](./scaffold-cli.md), qui génère par défaut **`variant-1/`** pour la première variante non contrôle.

- **`config.json`** : à la racine, **métadonnées de campagne** (`id`, `name`, `type`, statut, confidentialité, **références** aux segments) ; le tableau **`variations`** décrit chaque variante et, en front, les chemins d’assets. Optionnellement **`shared/`** + champs **`sharedJsPath`** / **`sharedCssPath`** pour du JS/CSS commun à **toutes** les variations (voir ci-dessous).
- Les sous-dossiers **`variant-x/`** portent les fichiers **statiques** servis ou référencés par URL (souvent via l’URL du **remote** en dev).

## Fichier `config.json`

Le fichier mélange deux niveaux : la **configuration de la campagne** (objet racine) et la liste **`variations`** (objets imbriqués). Les découper en lecture évite de confondre « ce qui s’applique à toute la campagne » et « ce qui est propre à chaque variante ».

### Configuration de la campagne (champs racine)

**Identifiant campagne** : entier **10000–99999** (JSON `number`). Stable pour l’API, les intégrations et le paramètre `ab_campaign_id`. Les **segments** (définition des ids, règles) sont sur la page **[Segments](./segments.md)**.

| Champ                            | Obligation | Valeur / forme                                                                                                                              | Rôle                                                                                                                                                                                                                                                   |
| -------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                             | requis     | Entier **10000–99999**.                                                                                                                     | Identifiant stable de la campagne.                                                                                                                                                                                                                     |
| `name`                           | requis     | Chaîne libre.                                                                                                                               | Libellé dans l’UI d’administration.                                                                                                                                                                                                                    |
| `type`                           | requis     | `frontend` ou `backend`.                                                                                                                    | Mode de livraison (voir tableau « deux axes » plus haut).                                                                                                                                                                                              |
| `status`                         | requis     | Littéraux du schéma (ex. `running`, `draft`).                                                                                               | Cycle de vie ; en cas d’erreur au save, voir la validation `storage-fs`.                                                                                                                                                                               |
| `privacyMode`                    | optionnel  | Absent ou `measurement` (défaut) ou `technical`.                                                                                            | Consentement analytics, tracking, cookie d’assignation.                                                                                                                                                                                                |
| `segments`                       | requis     | Tableau d’**entiers** (ids sous `Segments/`). `[]` = aucun filtre segment sur cette campagne.                                               | Ciblage : [Lien avec une campagne](./segments.md#lien-avec-une-campagne).                                                                                                                                                                              |
| `variations`                     | requis     | Tableau d’objets (voir section suivante).                                                                                                   | Liste ordonnée des variantes ; la **première** est en général la **contrôle**.                                                                                                                                                                         |
| `sharedJsPath` / `sharedCssPath` | optionnel  | Même forme que `jsPath` / `cssPath` des variations (URLs).                                                                                  | Campagne **`frontend`** : assets chargés **pour chaque** variante retournée par le moteur, **avant** le `jsPath` / `cssPath` de cette variante (logs, télémétrie, styles de base communs).                                                             |
| `simulationBaseUrl`              | optionnel  | URL de page (souvent `https://…`) utilisée comme base pour les **liens de simulation** dans l’UI admin (`ab_campaign_id`, `ab_simulation`). | Si absent, l’UI dérive un hôte à partir du champ racine **`domain`** dans `consent-config.json` (voir [Consentement](../consent.md)). Éditable aussi via `PUT /api/campaigns/:id`.                                                                     |
| `createdAt`                      | optionnel  | Chaîne **ISO 8601** (date/heure UTC).                                                                                                       | **Complété automatiquement** par l’API lors d’un **`POST /api/campaigns`** (création via l’UI admin ou appel direct). Persisté dans ce même `config.json`. Les fiches créées autrement peuvent ne pas avoir ce champ.                                  |
| `firstPublishedAt`               | optionnel  | Chaîne **ISO 8601**.                                                                                                                        | **Complété automatiquement** : première fois que le statut devient **`running`** (mise en ligne). L’API l’écrit lors d’un **`PUT`** qui applique ce statut si la valeur n’existait pas encore ; aussi à la création si la campagne est déjà `running`. |
| `lastStatusChangeAt`             | optionnel  | Chaîne **ISO 8601**.                                                                                                                        | **Complété automatiquement** à chaque changement de **`status`** via **`PUT /api/campaigns/:id`** (liste ou fiche campagne de l’UI admin, après confirmation).                                                                                         |
| `tags`                           | optionnel  | Tableau de **chaînes** (ex. `["lab","promo"]`), au plus **32** entrées, **64** caractères max par tag (validation `storage-fs`).            | Étiquettes pour **filtrer** les campagnes dans l’UI. L’API **normalise** en minuscules à l’enregistrement (`POST` / `PUT`). Éditables sur la fiche campagne ou à la main dans `config.json` ; un tableau **vide** ou l’absence du champ = aucun tag.   |

Les champs d’**horodatage** ci-dessus sont **stockés dans le fichier** `config.json` de la campagne (comme le reste de la configuration racine) : l’API lit le fichier, met à jour les champs concernés et réécrit le JSON. Tu peux les **éditer à la main** si besoin, mais en pratique l’UI et l’API les maintiennent à jour pour refléter les opérations ci-dessus.

### Variations (`variations[]`)

Chaque entrée décrit **une variante** (contrôle ou alternative) et, pour une campagne **`frontend`**, les **URLs des assets** à charger.

**Identifiants de variation** : `id` = **`idCampagne × 10 + emplacement`**, avec l’emplacement **0** pour la **contrôle** et **1–9** pour les autres — **au plus 10** variantes par campagne.

| Champ                | Obligation   | Valeur / forme                                                            | Rôle                                                                                                                                                                                                                                                          |
| -------------------- | ------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | requis       | Entier (formule ci-dessus).                                               | Identifiant stable de la variante.                                                                                                                                                                                                                            |
| `name`               | requis       | Chaîne libre.                                                             | Libellé lisible (ex. « Original », « Bandeau promo ») — **indépendant** du nom du dossier `variant-x`.                                                                                                                                                        |
| `trafficAllocation`  | requis       | Nombre (parts de trafic, ex. pourcentages selon convention produit).      | Répartition entre variantes.                                                                                                                                                                                                                                  |
| `jsPath` / `cssPath` | selon `type` | Chaînes (URLs absolues en démo vers le remote, URLs déployées en prod).   | Typiques d’une campagne **`frontend`** ; absentes ou non utilisées pour **`backend`** selon implémentation.                                                                                                                                                   |
| `featureFlags`       | optionnel    | Objet JSON : clés **chaîne** → valeurs **booléennes** (`true` / `false`). | Sert surtout aux campagnes **`backend`** : le **serveur** (ou BFF) lit ces drapeaux après `POST /api/evaluate` et branche sa stack (templates, handlers, réponses API, etc.). Peut aussi enrichir une variante **`frontend`** si ton intégration en a besoin. |

La **première** variation est en général la **contrôle** ; en cas de `consent_required`, c’est elle qui est renvoyée.

### Intégration `type: backend` (feature flags côté serveur) {#intégration-backend-feature-flags}

Contrairement au **`frontend`** (surcharge **JS/CSS** via le remote ou équivalent), une campagne **`backend`** ne repose pas sur l’injection d’assets dans le navigateur pour exprimer la variante. Le flux nominal est :

1. Le **serveur web** (ou un **BFF**) construit un **`UserContext`** (identifiant visiteur, route, cookies, champs GeoIP, etc.).
2. Il appelle **`POST /api/evaluate`** avec `campaignId` et ce contexte.
3. Il lit la réponse : notamment **`variation.id`**, **`variation.featureFlags`**, **`reason`** (et le reste du payload si utile).
4. Il **applique** la variante dans **sa propre stack** (réponse conditionnelle, SSR, logique métier, etc.).

Les drapeaux booléens sont donc **contrat serveur** : ils doivent correspondre à des branches que **ton code serveur** implémente (la config seule ne change pas le HTML sans cette couche).

Un exemple minimal est documenté côté lab **[Pages et URLs (small-webserver)](../../webserver/pages-and-urls.md#demo-ab-backend-lab)**.

## Exemple — campagne front « measurement »

Exemple **fictif** (dossier, libellés et ids d’illustration uniquement) :

`Campaigns/SummerPromo_Header/config.json` :

```json
{
  "id": 42817,
  "name": "Bannière été — test A/B",
  "type": "frontend",
  "status": "running",
  "segments": [],
  "variations": [
    {
      "id": 428170,
      "name": "Original",
      "trafficAllocation": 50
    },
    {
      "id": 428171,
      "name": "Variante ruban promo",
      "trafficAllocation": 50,
      "jsPath": "https://cdn.example.org/ab/Campaigns/SummerPromo_Header/variant-1/script.js",
      "cssPath": "https://cdn.example.org/ab/Campaigns/SummerPromo_Header/variant-1/style.css"
    }
  ]
}
```

En développement local, les `jsPath` / `cssPath` pointent souvent vers le **remote** (ex. `http://localhost:5001/...`) ; en production, utilise des URLs déployées stables.

## Exemple — campagne front « technical » {#exemple-campagne-technical}

Exemple **`technical`** **fictif** (schéma valide ; ids et chemins d’URL d’illustration) :

```json
{
  "id": 51902,
  "name": "Correctif UI — sans mesure (exemple)",
  "type": "frontend",
  "privacyMode": "technical",
  "status": "running",
  "segments": [],
  "variations": [
    {
      "id": 519020,
      "name": "Comportement actuel",
      "trafficAllocation": 50
    },
    {
      "id": 519021,
      "name": "Correctif accessibilité",
      "trafficAllocation": 50,
      "jsPath": "https://cdn.example.org/ab/Campaigns/UiFix_Accessibility/variant-1/script.js",
      "cssPath": "https://cdn.example.org/ab/Campaigns/UiFix_Accessibility/variant-1/style.css"
    }
  ]
}
```

Comportement lié au consentement : [Consentement](../consent.md).

## Édition via l’UI

L’**interface d’administration** (`apps/ui`) permet notamment de **créer** une campagne (saisie d’un **id numérique** 10000–99999 + nom + type) et de **parcourir** campagnes et segments. Les écritures passent par l’**API**, qui persiste sous `abtest-campaigns-segments/Campaigns/`.

Pour un **squelette** de campagne ou de segment avec id auto-alloué depuis le dépôt, utiliser la [CLI scaffold](./scaffold-cli.md) (les segments eux-mêmes restent décrits dans [Segments](./segments.md)).

## Voir aussi

- [Segments](./segments.md)
- [CLI : squelettes (IDE)](./scaffold-cli.md)
- [Introduction campagnes & segments](./index.md)
