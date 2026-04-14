# Consentement et confidentialité des campagnes

## Concepts

- **Cookie d’acceptation** : fichier **`consent-config.json`** à la racine de **`abtest-campaigns-segments`**, surcharge possible par **variables d’environnement** API.
- **`privacyMode`** sur chaque campagne : **`measurement`** (défaut si absent) ou **`technical`**.
- Indépendant du champ **`type`** de livraison : `frontend` \| `backend`.

## Valeurs de `privacyMode` et comportements

| Valeur        | Présence dans le JSON                                          | Comportement                                                                                                                                                     |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `measurement` | Défaut si le champ est **absent** ou littéral `"measurement"`. | Garde-fou `consent-config` si actif ; tracking et persistance sticky (remote : `localStorage` + migration depuis l’ancien cookie `ab_var_*`) si consentement OK. |
| `technical`   | Littéral explicite `"technical"`.                              | Pas d’exigence de cookie analytics ; pas de `trackExposure` ; pas de persistance sticky d’assignation côté remote.                                               |

### Cas d’usage (résumé)

| Situation                                                            | Effet                                                                                                            |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `measurement` et consentement **non** satisfait (`consent_required`) | Variante **contrôle** ; pas de tracking ; le remote supprime l’entrée sticky (store + ancien cookie `ab_var_*`). |
| `measurement` et consentement OK                                     | Évaluation complète ; tracking et assignation selon le moteur.                                                   |
| `technical`                                                          | Pas de lien avec le cookie analytics ; jamais de tracking ni de cookie d’assignation pour cette campagne.        |

## Fichier `consent-config.json`

Emplacement : racine **`abtest-campaigns-segments`**.

```json
{
  "acceptanceCookie": {
    "name": "analytics_consent",
    "value": "granted"
  }
}
```

### Propriétés JSON

| Champ                    | Obligation                       | Description                                                            |
| ------------------------ | -------------------------------- | ---------------------------------------------------------------------- |
| `acceptanceCookie`       | Si le fichier est utilisé        | Objet `{ "name", "value" }` : couple attendu pour le garde-fou.        |
| `acceptanceCookie.name`  | Requis pour activer le garde-fou | Chaîne non vide. Nom vide ou fichier absent ⇒ pas de garde-fou.        |
| `acceptanceCookie.value` | Si garde-fou actif               | Égalité stricte avec `context.cookies[name]` sur `POST /api/evaluate`. |

### Surcharge environnement (API)

| Variable                      | Obligation | Description                         |
| ----------------------------- | ---------- | ----------------------------------- |
| `ABTEST_CONSENT_COOKIE_NAME`  | optionnel  | Prioritaire sur `name` du fichier.  |
| `ABTEST_CONSENT_COOKIE_VALUE` | optionnel  | Prioritaire sur `value` du fichier. |

## API

| Endpoint                  | Rôle                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `GET /api/consent-config` | Indique si le garde-fou est actif et expose nom / valeur attendus pour aligner une CMP ou un bandeau. |

Voir [Aperçu de l’API](../reference/api-overview.md).

## Interface d’administration (UI)

| Élément                    | Édition                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `privacyMode` par campagne | UI (détail campagne) ou JSON — valeurs `measurement` \| `technical`.                                              |
| `consent-config.json`      | Fichier à la racine du dépôt données + variables d’environnement API — **pas** d’écran dédié dans l’UI à ce jour. |

## Exemple campagne `technical`

Schéma JSON illustratif (**exemple fictif**) : [Campagnes — exemple « technical »](./campaigns-segments/campaigns.md#exemple-campagne-technical).

## Références

- [Campagnes](./campaigns-segments/campaigns.md)
- [Module Federation](./module-federation.md)
