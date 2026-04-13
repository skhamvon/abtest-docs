# Dépannage

## Submodules vides

```bash
git submodule update --init --recursive
```

## Port déjà utilisé (`EADDRINUSE`)

Changer `PORT`, `VITE_*` selon [Ports et variables](./ports-and-env.md).

## `npm install` (proxy / SSL / 403)

Configurer proxy ou registry npm selon l’IT.

## Consentement actif mais toujours contrôle

Vérifier que `context.cookies` contient le bon couple nom/valeur pour les campagnes `measurement`. Voir [Consentement](../solution/consent.md).

## Submodule « modified content »

```bash
cd chemin/du/submodule
git status
```

Commit, stash ou nettoyage selon le cas.
