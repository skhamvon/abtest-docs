# Référence des segments

Chaque segment a au minimum `id` et `name`, optionnellement `description`.

## Format recommandé : `rules`

Tableau de règles reliées par un **ET** logique (toutes doivent être vraies). Un tableau vide `[]` signifie « tous les utilisateurs ».

## Contexte (`UserContext`)

Champs utiles dans `@abtest-solution/core` : `route`, `url`, `queryParams`, `country` (souvent GeoIP), `region`, `city`, `device`, `screenWidth` / `screenHeight`, `browser`, `browserVersion`, `browserLanguage`, `cookies`, `visitorType` (`new` \| `returning`), `domPresence`, `customRuleResults`.

Le bundle **remote** (`buildBrowserEvaluateContext`) remplit la partie navigateur (dont `visitorType` via le cookie `abtest_returning`) ; le pays / région / ville viennent en général d’un **BFF, edge ou CDN** si vous les injectez avant l’appel à `/api/evaluate`.

## Types de règles

| `type`            | `op` (ou champs)                                            | Champs principaux | Description                                                                                      |
| ----------------- | ----------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `country`         | `in`                                                        | `values`          | Pays (ISO), ex. GeoIP                                                                            |
| `region`          | `in`                                                        | `values`          | Région (codes ou libellés selon votre pipeline)                                                  |
| `city`            | `in`                                                        | `values`          | Ville : égalité dans la liste                                                                    |
| `city`            | `contains`                                                  | `value`           | Sous-chaîne sur la ville                                                                         |
| `device`          | `in`                                                        | `values`          | `desktop` \| `mobile` \| `tablet`                                                                |
| `loggedIn`        | `eq`                                                        | `value`           | Booléen                                                                                          |
| `route`           | `prefixOneOf`                                               | `prefixes`        | Préfixes de chemin (`route`)                                                                     |
| `url`             | `eq` \| `contains` \| `startsWith` \| `endsWith` \| `regex` | `value`           | URL effective (`url` ou recomposition route + query)                                             |
| `queryParam`      | `exists`                                                    | `name`            | Paramètre présent et non vide                                                                    |
| `queryParam`      | `eq` \| `contains` \| `regex`                               | `name`, `value`   | Sur la première valeur du param                                                                  |
| `screen`          | `widthGte` \| `widthLte` \| `heightGte` \| `heightLte`      | `value` (nombre)  | Pixels                                                                                           |
| `browser`         | `in`                                                        | `values`          | Identifiants normalisés (ex. `chrome`)                                                           |
| `browserVersion`  | `eq` \| `startsWith` \| `regex`                             | `value`           | Chaîne de version (ex. majeure UA)                                                               |
| `browserLanguage` | `in`                                                        | `values`          | ex. `fr` accepte aussi `fr-FR`                                                                   |
| `customRule`      | —                                                           | `ruleId`          | `customRuleResults[ruleId] === true` (fonctions JS enregistrées côté hôte, pas d’`eval` serveur) |
| `dom`             | `exists`                                                    | `presenceKey`     | `domPresence[presenceKey] === true` (hôte fait le `querySelector`)                               |
| `cookie`          | `exists`                                                    | `name`            | Nom présent dans `cookies`                                                                       |
| `cookie`          | `eq` \| `contains`                                          | `name`, `value`   | Valeur du cookie                                                                                 |
| `visitorType`     | `eq`                                                        | `value`           | `new` ou `returning` — aligné sur `context.visitorType`                                          |

**Segments d’exemple** (dossiers sous `Segments/`) : `UrlExactPath`, `UrlStartsWithPath`, `UrlContainsPromo`, `UrlRegexArticle`, `QueryParamUtmSource`, `QueryParamCampaignEq`, `QueryParamRefContains`, `ScreenDesktopWide`, `VisitorCountryFr`, `VisitorRegionIdf`, `VisitorCityParis`, `VisitorCityInList`, `CombinedPromoDesktopFr`, `BrowserChrome`, `BrowserVersionStartsWith`, `BrowserLanguageFrench`, `NewVisitor`, `ReturningVisitor`, `CustomRuleEngageUser`, `DomElementDemoHeader`, `DomElementDemoArticle`, `CookieConsentYes`, `CookieSessionExists`, ainsi que `AllUsers`, `FranceOnly`, `MobileOnly`.

## Exemple `rules`

```json
{
  "id": "segment-france-only",
  "name": "France uniquement",
  "description": "Cible uniquement les utilisateurs dont le pays est FR.",
  "rules": [{ "type": "country", "op": "in", "values": ["FR"] }]
}
```

## Format historique : `criteria`

Toujours accepté pour la transition. S’il n’y a pas de clé `rules` dans le fichier, le moteur dérive les règles à partir de `criteria` :

```json
{
  "id": "segment-france-only",
  "name": "France uniquement",
  "criteria": {
    "country": ["FR"],
    "device": ["mobile"],
    "loggedIn": true,
    "routePrefix": ["/shop"]
  }
}
```

Les clés inconnues dans `criteria` sont rejetées par la validation (fichier refusé) pour éviter les typos silencieuses. Les **nouveaux** segments devraient utiliser `rules`.
