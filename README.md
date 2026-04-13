# abtest-docs

Documentation publique (**VitePress**) pour l’environnement hackathon : vue d’ensemble des dépôts, installation (projet complet, solution A/B test, serveur de labo), guide du **small-webserver**, guide de la **solution** (consentement, campagnes, segments, Module Federation), et pages de référence (ports, submodules, API, dépannage).

## Site en ligne

Après activation de **GitHub Pages** sur la branche `gh-pages` (déployée par l’action CI) :

**https://skhamvon.github.io/abtest-docs/**

## Développement local

Prérequis : **Node.js 20+** et `npm`.

```bash
npm install
npm run docs:dev
```

Build : `npm run docs:build` (sortie dans `docs/.vitepress/dist/`).

## GitHub Pages

**Settings → Pages** → branche **`gh-pages`**. Workflow : [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

## Submodule `hackathon-abtest`

```bash
git submodule add git@github.com:skhamvon/abtest-docs.git abtest-docs
```

Dépôt parent : [hackathon-abtest](https://github.com/skhamvon/hackathon-abtest).
