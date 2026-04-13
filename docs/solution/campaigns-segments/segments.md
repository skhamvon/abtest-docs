# Segments

## Rôle

Un **segment** décrit un **ensemble d’utilisateurs** (ou de contextes) auquel on peut rattacher une campagne. Les règles s’évaluent contre un **`UserContext`** fourni à `/api/evaluate`.

## Lien avec une campagne

Dans le `config.json` d’une **[campagne](./campaigns.md)**, le champ **`segments`** est un tableau d’**ids numériques** qui pointent vers des entrées sous `Segments/` (même valeur que le champ `id` de chaque segment). **`[]`** signifie qu’aucun segment n’est requis pour l’éligibilité : le moteur ne filtre pas sur des règles de segment pour cette campagne.

Si la liste est **non vide**, l’utilisateur doit satisfaire **au moins un** des segments listés (chacun est évalué via une **condition** booléenne, en général un arbre **ET / OU** ; la campagne reste éligible dès qu’**un** segment du tableau matche le contexte).

Pour un **diagnostic critère par critère** (valeur attendue vs valeur actuelle dans un `UserContext` de test), le mode simulation côté API expose `POST /api/evaluate/segment-diagnostics` — voir [Aperçu de l’API](../../reference/api-overview.md). L’interface d’administration peut l’utiliser pour la prévisualisation ; ce n’est pas le chemin nominal d’assignation de variante.

## Arborescence dans le dépôt

Sous **`abtest-campaigns-segments/Segments/`**, chaque segment est en général un dossier :

```text
Segments/
  VisitorsTablet_FR/
    config.json
  ...
```

Chaque **`config.json`** contient au minimum `id` et `name`, souvent `description`, et les règles de ciblage. Le champ **`id`** est un **nombre entier** dans la plage **1000–9999** (type JSON `number`).

## Fichier `config.json`

### Format `condition` (ET / OU / NON)

Arbre booléen exposé par le moteur après normalisation :

- **`allOf`** — tableau **`conditions`** : **toutes** les sous-conditions doivent être vraies (**ET**). Tableau vide → segment **universel** (toujours vrai).
- **`anyOf`** — tableau **`conditions`** : **au moins une** sous-condition doit être vraie (**OU**). Tableau vide → **jamais** vrai.
- **`not`** — une seule sous-clé **`condition`** : le résultat est l’inverse de cette sous-condition (**NON**).

Chaque élément de `conditions` est soit une **règle feuille** (objet avec `type` = pays, URL, etc., voir [Types de segment](./segment-types.md)), soit un autre nœud `allOf` / `anyOf` / `not`. Tu peux **imbriquer** librement (ex. **(A OU B) ET C** = un `allOf` dont le premier enfant est un `anyOf` sur A et B, le second est C).

D’autres **exemples JSON** (tableau récapitulatif, OU sur pays, **NON** combiné avec **ET**) sont sur la page [Conditions de segment](./segment-conditions.md).

Dans un même **`config.json`**, il faut **exactement un** des deux : soit **`condition`**, soit **`rules`** (pas les deux, pas l’absence des deux). Sinon la validation **`storage-fs`** rejette le fichier.

Après chargement, l’API (`GET /api/segments`, etc.) renvoie toujours le segment avec le champ **`condition`** (forme normalisée interne), y compris quand le fichier ne contient que **`rules`**.

### `rules` (liste plate = ET)

Tableau de règles feuilles, équivalent à `{ "type": "allOf", "conditions": [ … ] }`. Un tableau vide **`[]`** signifie « tous les utilisateurs » (segment universel).

Exemple minimal :

```json
{
  "id": 3842,
  "name": "Tous les utilisateurs",
  "description": "Segment par défaut qui matche tout le monde.",
  "rules": []
}
```

Exemple avec une règle pays :

```json
{
  "id": 9156,
  "name": "France uniquement",
  "description": "Cible uniquement les utilisateurs dont le pays est FR.",
  "rules": [{ "type": "country", "operator": "isAnyOf", "values": ["FR"] }]
}
```

L’équivalent d’un ancien bloc **`criteria`** (pays / device / `loggedIn`) s’exprime en **`rules`** (voir [Types de segment](./segment-types.md)) — par exemple pays FR **et** mobile **et** connecté : trois entrées dans le tableau `rules`, combinées en **ET**.

Pour des **exemples JSON** d’arbres **`condition`** (OU sur pays, combinaisons **(A OU B) ET C**, **not**), voir **[Conditions de segment](./segment-conditions.md)**.

## Contexte (`UserContext`)

Champs utiles côté moteur (`@abtest-solution/core`) :

`route`, `url`, `queryParams`, `country` (souvent GeoIP), `region`, `city`, `device`, `screenWidth` / `screenHeight`, `browser`, `browserVersion`, `browserLanguage`, `cookies`, `visitorType` (`new` \| `returning`), `domPresence`, `customRuleResults`.

- Le **remote** (`buildBrowserEvaluateContext`) remplit la partie **navigateur** (dont `visitorType` via un cookie démo du type `abtest_returning`).
- **`country` / `region` / `city`** : en production, souvent injectés par un **BFF**, **edge** ou **CDN** avant l’appel à `/api/evaluate`, si tu ne te limites pas au seul contexte client.

## Types de règles (feuilles)

Chaque règle feuille est un objet JSON avec **`type`**, **`operator`** (sauf cas sans opérateur), et les champs attendus par le moteur. En liste **`rules`**, elles sont reliées par un **ET** ; avec **`condition`**, l’ET / OU / NON est explicite.

La **référence des règles feuilles** (tous les `type`, opérateurs, paramètres) est sur **[Types de segment](./segment-types.md)**. Pour l’arbre **`condition`** (ET / OU / NON, exemples), voir **[Conditions de segment](./segment-conditions.md)**.

## Voir aussi

- [CLI : squelettes (IDE)](./scaffold-cli.md) — créer un segment depuis l’IDE avec id libre
- [Conditions de segment](./segment-conditions.md) — arbre `condition`, exemples JSON
- [Types de segment](./segment-types.md) — catalogue des `type` / `operator` / JSON
- [Campagnes](./campaigns.md)
- [Consentement](../consent.md) — cookies dans le contexte
- [Module Federation](../module-federation.md)
