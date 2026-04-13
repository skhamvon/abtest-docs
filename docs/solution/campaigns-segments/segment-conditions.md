# Conditions de segment (ET / OU / NON)

Un segment est vrai pour un **`UserContext`** si son arbre **`condition`** s’évalue à vrai. Les **feuilles** de cet arbre sont les règles décrites dans [Types de segment](./segment-types.md) (`country`, `url`, `device`, etc.).

Pour le fichier `config.json`, le périmètre des champs `rules` et `condition` et le comportement API, voir [Règles et contexte](./segments.md#fichier-configjson).

## Nœuds

| Nœud        | Champ                      | Rôle                                                                                                           |
| ----------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **`allOf`** | `conditions` (tableau)     | **ET** : toutes les sous-conditions doivent être vraies. Tableau **vide** → segment universel (toujours vrai). |
| **`anyOf`** | `conditions` (tableau)     | **OU** : au moins une sous-condition vraie. Tableau **vide** → jamais vrai.                                    |
| **`not`**   | `condition` (objet unique) | **NON** : inverse le résultat de la sous-condition.                                                            |

Les sous-éléments peuvent être des **feuilles** (objets avec un `type` de règle) ou d’autres nœuds `allOf` / `anyOf` / `not` (**imbrication** libre).

Dans un fichier segment, **`condition`** et **`rules`** sont **mutuellement exclusifs** (sinon erreur de validation). Une liste **`rules`** seule équivaut à **`{ "type": "allOf", "conditions": [ …feuilles… ] }`** après chargement.

## Exemple : OU sur le pays (France ou Allemagne)

```json
{
  "type": "anyOf",
  "conditions": [
    { "type": "country", "operator": "isAnyOf", "values": ["FR"] },
    { "type": "country", "operator": "isAnyOf", "values": ["DE"] }
  ]
}
```

## Exemple : (A OU B) ET C

Ici : **(France ou mobile) ET** URL contient `/shop` :

```json
{
  "type": "allOf",
  "conditions": [
    {
      "type": "anyOf",
      "conditions": [
        { "type": "country", "operator": "isAnyOf", "values": ["FR"] },
        { "type": "device", "operator": "isAnyOf", "values": ["mobile"] }
      ]
    },
    { "type": "url", "operator": "contains", "value": "/shop" }
  ]
}
```

## Exemple : négation — URL sans `/promo`

```json
{
  "type": "not",
  "condition": {
    "type": "url",
    "operator": "contains",
    "value": "/promo"
  }
}
```

## Exemple : ET + NON — France et hors chemin `/promo`

```json
{
  "type": "allOf",
  "conditions": [
    { "type": "country", "operator": "isAnyOf", "values": ["FR"] },
    {
      "type": "not",
      "condition": {
        "type": "url",
        "operator": "contains",
        "value": "/promo"
      }
    }
  ]
}
```

## Segment complet (`config.json`)

Place l’objet racine ci-dessus dans **`"condition": { ... }`** à côté de **`id`**, **`name`**, etc. Pour un simple **ET** de feuilles sans OU/NON, tu peux aussi utiliser **`"rules": [ … ]`** — voir [exemple combiné](./segment-types.md#exemple-combiné) (équivalence avec `allOf`).

Les formats **`rules`** et **`condition`** (exclusifs l’un de l’autre dans le fichier) sont décrits dans [Règles et contexte](./segments.md#fichier-configjson) ; les **arbres** OU / NON / imbriqués sont centralisés **sur cette page** pour éviter les doublons.

## Voir aussi

- [Règles et contexte](./segments.md) — `config.json`, `UserContext`, réponse API
- [Types de segment](./segment-types.md) — catalogue des règles **feuilles** (`type` / `operator`)
- [Campagnes](./campaigns.md)
