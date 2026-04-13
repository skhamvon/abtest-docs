# Campagnes et segments — introduction

## Dépôt associé

Les définitions métier sont dans **`abtest-campaigns-segments`**, monté sous :

```text
abtest-solution/abtest-campaigns-segments/
```

**Dépôt :** [github.com/skhamvon/abtest-campaigns-segments](https://github.com/skhamvon/abtest-campaigns-segments)

## Contenu typique

- **`Campaigns/`** — un dossier par campagne : `config.json` + assets (ex. `variant-1/script.js`). Voir [Configuration et variantes](./campaigns.md).
- **`Segments/`** — un dossier par segment : `config.json` (ciblage via **`rules`** ou **`condition`**). Voir [Règles et contexte](./segments.md).
- **`consent-config.json`** (optionnel, racine du dépôt) — cookie d’acceptation pour le garde-fou des campagnes en **`measurement`**. Voir [Consentement](../consent.md).

Pas de `package.json` obligatoire : fichiers et assets statiques.

## Identifiants

Les **`id`** sont des **nombres entiers** (JSON `number`) : **campagnes** et **variations** — plages et formule dans [Configuration et variantes](./campaigns.md) ; **segments** — plage et fichiers dans [Règles et contexte](./segments.md).

## Travailler sur les données

```bash
git clone git@github.com:skhamvon/abtest-campaigns-segments.git
```

Puis mettre à jour le **pointeur de submodule** dans `abtest-solution` après push.

Sans passer par l’UI, la [CLI : squelettes](./scaffold-cli.md) génère un dossier + `config.json` avec le **prochain id libre** (`npm run scaffold:segment` / `scaffold:campaign` dans `abtest-solution`).

## Pages détaillées

### Campagnes

- [Configuration et variantes](./campaigns.md)

### Segments

- [Règles et contexte](./segments.md)
- [Conditions de segment](./segment-conditions.md) — arbre `condition` (ET / OU / NON), exemples
- [Types de segment](./segment-types.md) — règles feuilles (`type` / `operator`)

### Outil IDE (squelettes)

- [CLI : squelettes](./scaffold-cli.md) — dossiers + `config.json` avec id libre (`abtest-solution`)

## Liens

- [Submodules Git](../../reference/submodules.md)
- [Consentement](../consent.md)
