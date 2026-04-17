# Installer le web serveur de test

Cible : dépôt **`small-webserver`**.

## Obtenir les sources

**A.** Via hackathon : `hackathon-abtest/small-webserver/` après `git submodule update --init --recursive`.

**B.** Clone seul :

```bash
git clone git@github.com:skhamvon/small-webserver.git
cd small-webserver
```

## Prérequis

- **Node.js 20+**

## Installation

```bash
npm install
```

Copier `.env.example` → `.env` si besoin. Si `Unknown env config "devdir"` : `unset npm_config_devdir` ou script du dépôt.

## Développement

```bash
npm run dev
```

Build + prod locale : `npm run build` puis `npm start`.

## Documentation

[Serveur web de test — introduction](../webserver/intro.md)  
[Intégration `abtest-solution` sur le lab (liste des modifs)](../webserver/abtest-solution-changes.md)

## Variables

[Ports et variables — small-webserver](../reference/ports-and-env.md#small-webserver)
