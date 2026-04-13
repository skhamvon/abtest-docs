# Solution d’A/B test — introduction

## Rôle

Le dépôt **`abtest-solution`** fournit le moteur, l’**API**, l’**UI** d’administration et le **remote** Module Federation consommable par un site hôte (ex. labo `small-webserver`).

## Structure du monorepo

| Élément                      | Rôle                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api`                   | Express : CRUD campagnes / segments, `POST /api/evaluate`, `GET /api/consent-config` ; persistance via `storage-fs` (voir [Aperçu de l’API](../reference/api-overview.md)). |
| `apps/remote`                | Bundle Module Federation : contexte navigateur, injection des variantes (`VITE_REMOTE_PORT` en dev).                                                                        |
| `apps/ui`                    | Interface d’administration React (`VITE_UI_PORT` en dev).                                                                                                                   |
| `packages/core`              | Modèle métier, évaluation des règles, bucketing, consentement.                                                                                                              |
| `packages/storage-fs`        | Lecture / écriture JSON + validation (Zod) sous la racine données.                                                                                                          |
| `abtest-campaigns-segments/` | Submodule : campagnes, segments, `consent-config.json` optionnel ([introduction](./campaigns-segments/index.md)).                                                           |

## Installation

[Installer la solution d’A/B test](../install/abtest-solution.md)

## Dépendance données

Les définitions métier sont dans **`abtest-campaigns-segments`**, sous `abtest-solution/abtest-campaigns-segments/`. Voir [Campagnes et segments](./campaigns-segments/index.md) et [Submodules](../reference/submodules.md).

## Module fédéré sur un site quelconque

1. Builder et déployer `apps/remote` sur une URL stable.
2. Configurer Module Federation côté hôte.
3. Utiliser l’API / composants exposés pour évaluer et afficher.

Détail : [Module Federation et intégration hôte](./module-federation.md).

## Suite

- [Consentement](./consent.md)
- [Campagnes et segments](./campaigns-segments/index.md)
- [Aperçu de l’API](../reference/api-overview.md)
- [Ports et variables](../reference/ports-and-env.md)
