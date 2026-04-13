# Installer la solution d’A/B test

Cible : **`abtest-solution`** (seul ou `hackathon-abtest/abtest-solution`).

## Prérequis

- **Node.js 20+** et `npm`
- Submodule **`abtest-campaigns-segments`** initialisé

## Installation

```bash
cd abtest-solution
npm install
```

Si `.env.example` existe : `cp .env.example .env` puis adapter.

## Submodule campagnes et segments

```bash
cd abtest-solution
git submodule update --init abtest-campaigns-segments
```

Mise à jour distante :

```bash
git submodule update --init --remote abtest-campaigns-segments
git add abtest-campaigns-segments
git commit -m "chore: update campaigns/segments submodule pointer"
```

## Démarrer en développement

```bash
npm run dev
```

(ou par workspace selon les `package.json` de `apps/*`.)

## Squelettes campagne / segment (IDE)

Pour créer un dossier sous `abtest-campaigns-segments` avec un **id numérique encore libre** (sans l’UI) :

```bash
npm run scaffold:segment -- "Nom du segment"
npm run scaffold:campaign -- "Nom" frontend
```

Détail des plages, option `--id` et comportement : [CLI scaffold](../solution/campaigns-segments/scaffold-cli.md).

## Suite

- [Introduction à la solution](../solution/intro.md)
- [Ports et variables](../reference/ports-and-env.md)
- [Aperçu de l’API](../reference/api-overview.md)
