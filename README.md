# abtest-docs

Documentation publique (MkDocs Material) pour la solution d’A/B testing : architecture, données de configuration, consentement, segments et intégration hôte.

## Site en ligne

Après activation de **GitHub Pages** sur la branche `gh-pages` (déployée par l’action CI), la doc est disponible en général à :

**https://skhamvon.github.io/abtest-docs/**

(Ajuste l’URL si ton organisation ou le nom du dépôt diffère.)

## Développement local

Avec un environnement virtuel Python (recommandé, notamment sur les systèmes « externally managed ») :

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve
```

Ouvre `http://127.0.0.1:8000` pour prévisualiser. Build : `.venv/bin/mkdocs build` (sortie dans `site/`).

## GitHub Pages

Dans les paramètres du dépôt GitHub : **Pages** → source **Deploy from a branch** → branche **`gh-pages`** (créée par le workflow). L’action utilise [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

## Enregistrer ce dépôt comme submodule de `hackathon-abtest`

Si le dossier `abtest-docs` existe déjà sans être un submodule officiel :

1. Dans ce dépôt : `git add -A && git commit && git push` (branche `main` ou `master`).
2. À la racine de `hackathon-abtest` : sauvegarder le dossier si besoin, puis  
   `git submodule add git@github.com:skhamvon/abtest-docs.git abtest-docs`  
   (ou supprimer le dossier non-submodule puis la même commande), puis committer `.gitmodules` et le pointeur de submodule.

## Dépôt parent

Ce dépôt est référencé comme **submodule** depuis [`hackathon-abtest`](https://github.com/skhamvon/hackathon-abtest).
