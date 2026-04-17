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
  "domain": ".example.com",
  "acceptanceCookie": {
    "name": "analytics_consent",
    "value": "granted"
  }
}
```

### Propriétés JSON

| Champ                    | Obligation                                              | Description                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                 | **Requis** pour toute sauvegarde via l’UI admin (`PUT`) | Domaine du site (ex. `.example.com`, `lab.example.com`) : base pour les **liens de simulation** dans l’admin ; **non** utilisé par le moteur pour lire `context.cookies`. |
| `acceptanceCookie`       | Requis dans le corps `PUT`                              | Objet `{ "name", "value" }` : couple pour le garde-fou analytics.                                                                                                         |
| `acceptanceCookie.name`  | —                                                       | Chaîne. **Vide** ⇒ pas de garde-fou (`consent-config` inactif pour le moteur).                                                                                            |
| `acceptanceCookie.value` | Si garde-fou actif                                      | Égalité stricte avec `context.cookies[name]` sur `POST /api/evaluate`.                                                                                                    |

Les anciens fichiers avec `acceptanceCookie.domain` sont encore **lus** (valeur migrée vers `domain` à la volée) ; les nouvelles écritures placent `domain` à la racine.

### Surcharge environnement (API)

| Variable                       | Obligation | Description                                                                    |
| ------------------------------ | ---------- | ------------------------------------------------------------------------------ |
| `ABTEST_CONSENT_COOKIE_NAME`   | optionnel  | Prioritaire sur `acceptanceCookie.name` du fichier.                            |
| `ABTEST_CONSENT_COOKIE_VALUE`  | optionnel  | Prioritaire sur `acceptanceCookie.value` du fichier.                           |
| `ABTEST_CONSENT_COOKIE_DOMAIN` | optionnel  | Prioritaire sur **`domain`** racine du fichier (chaîne non vide si surcharge). |

## API

| Endpoint                  | Rôle                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/consent-config` | `stored` / `effective` : **domain** (site), **cookie** (nom/valeur), garde-fou actif ou non, `envOverrides`.               |
| `PUT /api/consent-config` | Corps : **`domain`** (chaîne non vide), **`acceptanceCookie`** `{ name, value }` ; écrit le fichier et recharge le moteur. |

Voir [Aperçu de l’API](../reference/api-overview.md).

## Interface d’administration (UI)

| Élément                    | Édition                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `privacyMode` par campagne | UI (détail campagne) ou JSON — valeurs `measurement` \| `technical`.                                                                             |
| `consent-config.json`      | Écran **Configuration** de l’UI admin (`/configuration`) ou édition directe du fichier ; surcharges possibles via variables d’environnement API. |

## Exemple campagne `technical`

Schéma JSON illustratif (**exemple fictif**) : [Campagnes — exemple « technical »](./campaigns-segments/campaigns.md#exemple-campagne-technical).

## Références

- [Campagnes](./campaigns-segments/campaigns.md)
- [Module Federation](./module-federation.md)
