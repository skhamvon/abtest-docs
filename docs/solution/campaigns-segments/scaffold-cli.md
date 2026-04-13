# Squelettes campagne / segment (CLI)

Outil **commun** aux campagnes et aux segments (voir les pages [Configuration et variantes](./campaigns.md) et [Règles et contexte](./segments.md) pour le détail métier de chaque type).

Pour les assets front, la doc recommande des dossiers **`variant-1`**, **`variant-2`**, … plutôt que des noms texte arbitraires ; le scaffold crée **`variant-1/`** par défaut.

Pour travailler **depuis l’IDE** sans réutiliser un id déjà pris, le monorepo **`abtest-solution`** fournit un script Node qui :

1. lit les `config.json` existants sous `abtest-campaigns-segments` ;
2. choisit le **plus petit id libre** dans la plage attendue ;
3. crée le dossier (nom dérivé du libellé, comme côté API) et un **`config.json`** minimal valide pour le schéma `storage-fs`.

Emplacement du script : `abtest-solution/scripts/scaffold-data.mjs` (plages alignées sur `packages/core/src/ids.ts`).

## Prérequis

- Être à la racine de **`abtest-solution`** (là où se trouve `abtest-campaigns-segments/`).
- **Node.js 20+**.

## Commandes npm

```bash
cd abtest-solution

npm run scaffold:segment -- "Nom du segment"
npm run scaffold:campaign -- "Nom de la campagne" frontend
npm run scaffold:campaign -- "Nom de la campagne" backend
```

Le `--` sépare les options de `npm` des arguments passés au script.

## Forcer un id (s’il est encore libre)

```bash
node scripts/scaffold-data.mjs segment "Mon segment" --id 3208
node scripts/scaffold-data.mjs campaign "Ma campagne" frontend --id 45102
```

Le script **refuse** d’écraser un `config.json` déjà présent dans le dossier cible.

## Après génération

- **Segment** : éditer `rules` ou `condition` dans le fichier créé (pas les deux).
- **Campagne** : compléter `segments`. Pour une campagne **`frontend`**, le script crée déjà un dossier **`variant-1/`** avec `script.js` et `style.css` minimaux, et renseigne **`jsPath`** / **`cssPath`** sur la variation « Variation 1 » (en dev, URLs du type `http://localhost:<port-remote>/Campaigns/<nom-du-dossier-campagne>/variant-1/…`). Pour **`backend`**, seul le `config.json` est créé (pas d’assets front).

## Rappel des plages d’ids

| Entité   | Plage (JSON `number`) | Variations (campagnes)         |
| -------- | --------------------- | ------------------------------ |
| Segment  | 1000–9999             | —                              |
| Campagne | 10000–99999           | `idCampagne × 10 + slot` (0–9) |

Voir aussi [Configuration et variantes](./campaigns.md) et [Règles et contexte](./segments.md).
