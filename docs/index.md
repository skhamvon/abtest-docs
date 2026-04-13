# Introduction

Ce site documente l’**environnement d’A/B testing** du hackathon : la **solution métier** (`abtest-solution`), le **dépôt de données** campagnes et segments, le **serveur web de démonstration** (`small-webserver`), et le dépôt **documentation** (`abtest-docs`).

## Objectif global

L’ensemble permet de :

- définir des **campagnes** et des **segments** (fichiers versionnés) ;
- les **évaluer** via une API et un **moteur** commun ;
- consommer les variantes côté site hôte grâce à un **remote** (Module Federation) ;
- **tester** charge perçue, intégration et bannière de consentement dans un labo web dédié.

La suite décrit [les dépôts en détail](./intro/repositories.md), puis [comment tout installer](./install/full-stack.md), et enfin la documentation du [serveur de test](./webserver/intro.md) et de la [solution A/B test](./solution/intro.md).

## Dépôts (aperçu)

| Type | Description (rôle) | Contenu / particularités |
| ---- | ------------------ | ------------------------ |
| [hackathon-abtest](https://github.com/skhamvon/hackathon-abtest) | Orchestration locale des projets via submodules. | Racine sans logique métier ; `.gitmodules` ; clone avec `--recursive` pour les données imbriquées. |
| [abtest-solution](https://github.com/skhamvon/abtest-solution) | Solution A/B : API, UI, remote, moteur. | Monorepo npm + submodule **`abtest-campaigns-segments`**. |
| [abtest-campaigns-segments](https://github.com/skhamvon/abtest-campaigns-segments) | Fichiers de config et assets des expérimentations. | `Campaigns/`, `Segments/`, `consent-config.json` optionnel ; pas de runtime Node dédié. |
| [small-webserver](https://github.com/skhamvon/small-webserver) | Labo d’intégration et de tests perçus. | Host + remote + Express, `THROTTLE_KBPS`, démos pages. |
| [abtest-docs](https://github.com/skhamvon/abtest-docs) | Ce site documentaire. | VitePress ; [Pages](https://skhamvon.github.io/abtest-docs/) en général. |

Les campagnes et segments **effectifs** consommés par la solution se trouvent dans le submodule imbriqué `abtest-solution/abtest-campaigns-segments/`.

Pour le détail de chaque dépôt et les liens entre eux, voir [Description des dépôts](./intro/repositories.md).
