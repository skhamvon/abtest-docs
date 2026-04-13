# Serveur web de test — introduction

## Rôle

Le dépôt **`small-webserver`** prépare un environnement avec **host** (Vite + React), **remote** Module Federation minimal, et **serveur Node** (Express) pour servir les builds et **simuler une bande passante limitée**.

Ce n’est **pas** requis en production ; la solution réelle est **`abtest-solution`**.

## Installation

[Installer le web serveur de test](../install/webserver.md)

## Pages de cette section

| Page                                         | Contenu                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Pages et URLs](./pages-and-urls.md)         | URLs `localhost`, chemins `/demo/*`, `/ovh-bare-metal/` — routes de démo et clone statique. |
| [Limitation de débit](./network-throttle.md) | `THROTTLE_KBPS`, routes `/__dev/throttle` — simulation de liaison lente.                    |
| [Développement et build](./development.md)   | Scripts `npm run dev`, `build`, `start` — lancer le labo en local.                          |

[Ports et variables d’environnement](../reference/ports-and-env.md#small-webserver)
