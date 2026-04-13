# Description des dépôts

## hackathon-abtest

**Rôle :** orchestrer les projets via **submodules Git**, sans code applicatif à cette racine.

**Contenu typique après `git submodule update --init --recursive` :**

- `small-webserver/` — labo web de test ;
- `abtest-solution/` — solution A/B test ;
- `abtest-docs/` — ce site ;
- `.gitmodules` — URLs des submodules.

**Données métier (campagnes / segments) :** elles vivent dans `abtest-solution/abtest-campaigns-segments/` (submodule du dépôt `abtest-campaigns-segments`).

```bash
git clone git@github.com:skhamvon/hackathon-abtest.git
cd hackathon-abtest
git submodule update --init --recursive
```

Voir aussi [Submodules Git](../reference/submodules.md).

---

## abtest-solution

**Rôle :** solution d’A/B testing (moteur, API HTTP, UI admin, bundle **remote** via Module Federation).

**Structure principale :**

| Élément                      | Rôle                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `apps/api`                   | API Express : CRUD campagnes/segments, `/api/evaluate`, `/api/consent-config` (`PORT`, souvent `5002`). |
| `apps/remote`                | Remote Module Federation (`VITE_REMOTE_PORT`, souvent `5001`).                                          |
| `apps/ui`                    | Interface d’administration React (`VITE_UI_PORT`, souvent `5174`).                                      |
| `packages/core`              | Moteur : segments, bucketing, consentement.                                                             |
| `packages/storage-fs`        | Lecture/écriture JSON + validation schéma sur le dépôt données.                                         |
| `abtest-campaigns-segments/` | Submodule : `Campaigns/`, `Segments/`, `consent-config.json` optionnel.                                 |

**Dépôt :** [github.com/skhamvon/abtest-solution](https://github.com/skhamvon/abtest-solution)

---

## abtest-campaigns-segments

**Rôle :** **données fonctionnelles** : campagnes, segments, assets variantes, optionnellement `consent-config.json`.

**Intégration :** submodule dans `abtest-solution` uniquement.

**Dépôt :** [github.com/skhamvon/abtest-campaigns-segments](https://github.com/skhamvon/abtest-campaigns-segments)

Voir [Campagnes et segments — introduction](../solution/campaigns-segments/index.md).

---

## small-webserver

**Rôle :** **labo** : host Vite+React, remote minimal, serveur Node (throttle, clone statique optionnel).

**Dépôt :** [github.com/skhamvon/small-webserver](https://github.com/skhamvon/small-webserver)

Documentation : [Serveur web de test](../webserver/intro.md).

---

## abtest-docs

**Rôle :** ce site (VitePress).

**Dépôt :** [github.com/skhamvon/abtest-docs](https://github.com/skhamvon/abtest-docs)
