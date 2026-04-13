# Types de segment (règles feuilles)

Les objets décrits ci-dessous sont des **règles feuilles** : chacun a au minimum **`type`**. La plupart exigent aussi **`operator`** et des champs de valeur.

Ils peuvent apparaître soit dans un tableau **`rules`** (alors combinés en **ET**), soit dans un arbre **`condition`** (`allOf` / `anyOf` / `not`) — voir la page dédiée **[Conditions de segment (ET / OU / NON)](./segment-conditions.md)** et [Règles et contexte](./segments.md#fichier-configjson).

Les types ci-dessous sont regroupés par **famille**. Pour le contexte d’évaluation (`UserContext`), voir [Règles et contexte](./segments.md#contexte-usercontext).

---

## URL et navigation

### `url`

Filtre sur l’**URL effective** du contexte (chaîne complète ou fragment selon le moteur). Pour cibler une portion d’URL (y compris la query reconstruite lorsque `url` n’est pas fournie), utilisez en pratique surtout **`contains`** sur la sous-chaîne voulue (voir l’exemple JSON ci-dessous).

**Opérateurs**

| Opérateur      | Rôle                                     |
| -------------- | ---------------------------------------- |
| `equals`       | Égalité stricte.                         |
| `contains`     | La cible contient la sous-chaîne.        |
| `startsWith`   | Préfixe.                                 |
| `endsWith`     | Suffixe.                                 |
| `matchesRegex` | Motif regex (comportement selon moteur). |

**Paramètres**

| Champ               | Type      | Obligation | Description                             |
| ------------------- | --------- | ---------- | --------------------------------------- |
| `type`              | `string`  | requis     | `"url"`.                                |
| `operator`          | `string`  | requis     | L’un des opérateurs ci-dessus.          |
| `value`             | `string`  | requis     | Valeur ou motif.                        |
| `ignoreQueryString` | `boolean` | optionnel  | Défaut `false`. Voir détail ci-dessous. |

Si `ignoreQueryString` est `true`, la comparaison ignore query et fragment : si `context.url` est une URL **absolue** (`http://` / `https://`), la cible est **`origin` + `pathname`** ; sinon (URL relative ou `route` + `queryParams`), la cible est le **chemin seul** sans `?…` ni `#…` (les `queryParams` ne sont pas concaténés). Voir [Règles et contexte](./segments.md#contexte-usercontext).

**Exemple**

```json
{
  "type": "url",
  "operator": "contains",
  "value": "promo=summer"
}
```

**Exemple (égalité sur origin + chemin, sans query)**

```json
{
  "type": "url",
  "operator": "equals",
  "value": "https://www.example.com/promo",
  "ignoreQueryString": true
}
```

---

### `queryParam`

Filtre sur un **paramètre de la query string** (`queryParams` du contexte). Les tests portent sur la **première** valeur du paramètre nommé.

**Opérateurs**

| Opérateur      | Rôle                                                  |
| -------------- | ----------------------------------------------------- |
| `exists`       | Le paramètre est présent et sa valeur n’est pas vide. |
| `equals`       | Égalité stricte avec `value`.                         |
| `contains`     | La valeur contient `value`.                           |
| `matchesRegex` | La valeur correspond au motif.                        |

**Paramètres**

| Champ      | Type     | Obligation           | Description                          |
| ---------- | -------- | -------------------- | ------------------------------------ |
| `type`     | `string` | requis               | `"queryParam"`.                      |
| `operator` | `string` | requis               | L’un des opérateurs ci-dessus.       |
| `name`     | `string` | requis               | Nom du paramètre (ex. `utm_source`). |
| `value`    | `string` | requis sauf `exists` | Valeur ou motif selon l’opérateur.   |

**Exemples**

```json
{ "type": "queryParam", "operator": "exists", "name": "utm_campaign" }
```

```json
{
  "type": "queryParam",
  "operator": "equals",
  "name": "source",
  "value": "newsletter"
}
```

---

## Caractéristiques de l’utilisateur

### `country`

Pays du visiteur (souvent **GeoIP** ou injecté par **BFF / edge**).

**Opérateurs**

| Opérateur | Rôle                                                 |
| --------- | ---------------------------------------------------- |
| `isAnyOf` | Le code pays du contexte doit figurer dans `values`. |

**Paramètres**

| Champ      | Type       | Obligation | Description                                       |
| ---------- | ---------- | ---------- | ------------------------------------------------- |
| `type`     | `string`   | requis     | `"country"`.                                      |
| `operator` | `string`   | requis     | `"isAnyOf"`.                                      |
| `values`   | `string[]` | requis     | Codes **ISO 3166-1 alpha-2**, ex. `["FR", "DE"]`. |

**Exemple**

```json
{ "type": "country", "operator": "isAnyOf", "values": ["FR", "BE", "CH"] }
```

---

### `region`

Région du visiteur (convention alignée sur ta chaîne **GeoIP** / données injectées).

**Opérateurs**

| Opérateur | Rôle                                           |
| --------- | ---------------------------------------------- |
| `isAnyOf` | La région du contexte doit être dans `values`. |

**Paramètres**

| Champ      | Type       | Obligation | Description                           |
| ---------- | ---------- | ---------- | ------------------------------------- |
| `type`     | `string`   | requis     | `"region"`.                           |
| `operator` | `string`   | requis     | `"isAnyOf"`.                          |
| `values`   | `string[]` | requis     | Codes ou libellés selon ton pipeline. |

---

### `city`

Ville du visiteur (égalité dans une liste ou sous-chaîne).

**Opérateurs**

| Opérateur  | Rôle                                                |
| ---------- | --------------------------------------------------- |
| `isAnyOf`  | Égalité stricte avec l’une des entrées de `values`. |
| `contains` | La ville du contexte contient `value`.              |

**Paramètres**

| Champ      | Type       | Obligation                 | Description               |
| ---------- | ---------- | -------------------------- | ------------------------- |
| `type`     | `string`   | requis                     | `"city"`.                 |
| `operator` | `string`   | requis                     | `isAnyOf` ou `contains`.  |
| `values`   | `string[]` | si `operator` = `isAnyOf`  | Liste de villes.          |
| `value`    | `string`   | si `operator` = `contains` | Sous-chaîne à rechercher. |

**Exemples**

```json
{ "type": "city", "operator": "isAnyOf", "values": ["Paris", "Lyon"] }
```

```json
{ "type": "city", "operator": "contains", "value": "Saint" }
```

---

### `device`

Type d’appareil dérivé du contexte.

**Opérateurs**

| Opérateur | Rôle                                           |
| --------- | ---------------------------------------------- |
| `isAnyOf` | Le device du contexte doit être dans `values`. |

**Valeurs autorisées dans `values`**

`desktop` · `mobile` · `tablet`

**Paramètres**

| Champ      | Type       | Obligation | Description                         |
| ---------- | ---------- | ---------- | ----------------------------------- |
| `type`     | `string`   | requis     | `"device"`.                         |
| `operator` | `string`   | requis     | `"isAnyOf"`.                        |
| `values`   | `string[]` | requis     | Uniquement les littéraux ci-dessus. |

**Exemple**

```json
{ "type": "device", "operator": "isAnyOf", "values": ["mobile", "tablet"] }
```

---

### `loggedIn`

Indique si l’utilisateur est considéré comme **authentifié** (fourni par l’hôte / BFF selon ton intégration).

**Opérateurs**

| Opérateur | Rôle                             |
| --------- | -------------------------------- |
| `equals`  | Comparaison à `true` ou `false`. |

**Paramètres**

| Champ      | Type      | Obligation | Description        |
| ---------- | --------- | ---------- | ------------------ |
| `type`     | `string`  | requis     | `"loggedIn"`.      |
| `operator` | `string`  | requis     | `"equals"`.        |
| `value`    | `boolean` | requis     | `true` ou `false`. |

**Exemple**

```json
{ "type": "loggedIn", "operator": "equals", "value": true }
```

---

### `visitorType`

Nouveau visiteur ou retour, aligné sur `context.visitorType` (souvent **cookie** côté remote, ex. démo `abtest_returning`).

**Opérateurs**

| Opérateur | Rôle                                      |
| --------- | ----------------------------------------- |
| `equals`  | Littéral autorisé : `new` ou `returning`. |

**Paramètres**

| Champ      | Type     | Obligation | Description               |
| ---------- | -------- | ---------- | ------------------------- |
| `type`     | `string` | requis     | `"visitorType"`.          |
| `operator` | `string` | requis     | `"equals"`.               |
| `value`    | `string` | requis     | `"new"` ou `"returning"`. |

**Exemple**

```json
{ "type": "visitorType", "operator": "equals", "value": "new" }
```

---

## Caractéristiques du navigateur

### `browser`

Famille de navigateur (identifiants **normalisés** côté moteur, ex. `chrome`, `firefox`).

**Opérateurs**

| Opérateur | Rôle                                               |
| --------- | -------------------------------------------------- |
| `isAnyOf` | Le navigateur du contexte doit être dans `values`. |

**Paramètres**

| Champ      | Type       | Obligation | Description                           |
| ---------- | ---------- | ---------- | ------------------------------------- |
| `type`     | `string`   | requis     | `"browser"`.                          |
| `operator` | `string`   | requis     | `"isAnyOf"`.                          |
| `values`   | `string[]` | requis     | Identifiants supportés par le moteur. |

**Exemple**

```json
{ "type": "browser", "operator": "isAnyOf", "values": ["chrome", "edge"] }
```

---

### `browserVersion`

Chaîne de version du navigateur.

**Opérateurs**

| Opérateur   | Rôle                                                             |
| ----------- | ---------------------------------------------------------------- |
| `equals`    | Égalité stricte sur la chaîne complète.                          |
| `olderThan` | Version du contexte **strictement inférieure** au seuil `value`. |
| `newerThan` | Version du contexte **strictement supérieure** au seuil `value`. |

Pour `olderThan` / `newerThan`, la comparaison utilise les **segments numériques** (séquences de chiffres séparées par `.`, `-`, `_`, espaces, etc.). Ex. `119.0.1` avant `120`, `14` avant `15.2`. Si la version du contexte ou `value` ne contient **aucun** chiffre, ces opérateurs ne matchent pas.

**Paramètres**

| Champ      | Type     | Obligation | Description                                                                                |
| ---------- | -------- | ---------- | ------------------------------------------------------------------------------------------ |
| `type`     | `string` | requis     | `"browserVersion"`.                                                                        |
| `operator` | `string` | requis     | L’un des opérateurs ci-dessus.                                                             |
| `value`    | `string` | requis     | Chaîne exacte pour `equals` ; seuil numérique par segments pour `olderThan` / `newerThan`. |

**Exemple (`equals`)**

```json
{ "type": "browserVersion", "operator": "equals", "value": "120.0.6099.109" }
```

**Exemples (seuils numériques)**

```json
{ "type": "browserVersion", "operator": "olderThan", "value": "120" }
```

```json
{ "type": "browserVersion", "operator": "newerThan", "value": "119.0.0" }
```

---

### `browserLanguage`

Langues du navigateur (codes type `fr`, `en` ; **`fr`** couvre aussi des variantes comme **`fr-FR`** selon le moteur).

**Opérateurs**

| Opérateur | Rôle                                                              |
| --------- | ----------------------------------------------------------------- |
| `isAnyOf` | La langue du contexte doit matcher l’une des entrées de `values`. |

**Paramètres**

| Champ      | Type       | Obligation | Description          |
| ---------- | ---------- | ---------- | -------------------- |
| `type`     | `string`   | requis     | `"browserLanguage"`. |
| `operator` | `string`   | requis     | `"isAnyOf"`.         |
| `values`   | `string[]` | requis     | Codes langue.        |

**Exemple**

```json
{ "type": "browserLanguage", "operator": "isAnyOf", "values": ["fr", "fr-FR"] }
```

---

### `screen`

Seuils sur **largeur** ou **hauteur** en **pixels** (viewport ou écran selon comment le contexte est rempli).

**Opérateurs**

| Opérateur       | Rôle             |
| --------------- | ---------------- |
| `widthAtLeast`  | Largeur ≥ seuil. |
| `widthAtMost`   | Largeur ≤ seuil. |
| `heightAtLeast` | Hauteur ≥ seuil. |
| `heightAtMost`  | Hauteur ≤ seuil. |

**Paramètres**

| Champ      | Type     | Obligation | Description                           |
| ---------- | -------- | ---------- | ------------------------------------- |
| `type`     | `string` | requis     | `"screen"`.                           |
| `operator` | `string` | requis     | L’un des quatre opérateurs ci-dessus. |
| `value`    | `number` | requis     | Seuil en pixels (entier).             |

**Exemple**

```json
{ "type": "screen", "operator": "widthAtLeast", "value": 1280 }
```

---

## Critères techniques

### `customRule`

Délégation à du **code JavaScript côté hôte** : aucune expression n’est évaluée sur le serveur. Le contexte doit exposer `customRuleResults[ruleId] === true`.

Il n’y a **pas** de clé **`operator`** : seul **`ruleId`** identifie la règle.

**Paramètres**

| Champ    | Type     | Obligation | Description                            |
| -------- | -------- | ---------- | -------------------------------------- |
| `type`   | `string` | requis     | `"customRule"`.                        |
| `ruleId` | `string` | requis     | Clé attendue dans `customRuleResults`. |

**Exemple**

```json
{ "type": "customRule", "ruleId": "engageUser" }
```

---

### `dom`

L’**hôte** indique si un marqueur DOM est présent via `domPresence[presenceKey] === true` (ex. après `querySelector` côté client).

**Opérateurs**

| Opérateur | Rôle                                                 |
| --------- | ---------------------------------------------------- |
| `exists`  | La clé de présence doit être vraie dans le contexte. |

**Paramètres**

| Champ         | Type     | Obligation | Description             |
| ------------- | -------- | ---------- | ----------------------- |
| `type`        | `string` | requis     | `"dom"`.                |
| `operator`    | `string` | requis     | `"exists"`.             |
| `presenceKey` | `string` | requis     | Clé dans `domPresence`. |

**Exemple**

```json
{ "type": "dom", "operator": "exists", "presenceKey": "demoHeader" }
```

---

### `cookie`

Présence ou contenu d’un **cookie** lu depuis `context.cookies`.

**Opérateurs**

| Opérateur  | Rôle                                         |
| ---------- | -------------------------------------------- |
| `exists`   | Le cookie nommé existe.                      |
| `equals`   | Égalité stricte sur la valeur.               |
| `contains` | La valeur du cookie contient la sous-chaîne. |

**Paramètres**

| Champ      | Type     | Obligation                        | Description                    |
| ---------- | -------- | --------------------------------- | ------------------------------ |
| `type`     | `string` | requis                            | `"cookie"`.                    |
| `operator` | `string` | requis                            | L’un des opérateurs ci-dessus. |
| `name`     | `string` | requis                            | Nom du cookie.                 |
| `value`    | `string` | requis pour `equals` / `contains` | Valeur ou fragment à comparer. |

**Exemples**

```json
{ "type": "cookie", "operator": "exists", "name": "session_id" }
```

```json
{ "type": "cookie", "operator": "equals", "name": "consent", "value": "yes" }
```

---

## Exemple combiné

Plusieurs règles feuilles en **ET** (format `rules`, équivalent à un `allOf` sur ces mêmes objets) :

```json
{
  "id": 8471,
  "name": "FR + mobile",
  "rules": [
    { "type": "country", "operator": "isAnyOf", "values": ["FR"] },
    { "type": "device", "operator": "isAnyOf", "values": ["mobile"] }
  ]
}
```

Équivalent explicite avec **`condition`** :

```json
{
  "id": 8471,
  "name": "FR + mobile",
  "condition": {
    "type": "allOf",
    "conditions": [
      { "type": "country", "operator": "isAnyOf", "values": ["FR"] },
      { "type": "device", "operator": "isAnyOf", "values": ["mobile"] }
    ]
  }
}
```

D’autres combinaisons (**OU**, **NON**, imbrication) sont illustrées dans [Conditions de segment](./segment-conditions.md) et [Règles et contexte](./segments.md#fichier-configjson).

## Voir aussi

- [Conditions de segment (ET / OU / NON)](./segment-conditions.md) — arbre `condition`, exemples
- [Règles et contexte](./segments.md) — `config.json`, `UserContext`
- [Consentement](../consent.md) — cookies et contexte
- [Campagnes](./campaigns.md)
