# Développement local

## Dépôt hackathon (point d’entrée)

Le dépôt **`hackathon-abtest`** orchestre les sous-projets via des **submodules Git** (dont `abtest-solution`, `small-webserver`, et cette documentation `abtest-docs`).

### Clonage avec tous les submodules

```bash
git clone git@github.com:skhamvon/hackathon-abtest.git
cd hackathon-abtest
git submodule update --init --recursive
```

### Mise à jour des submodules

```bash
git submodule update --init --recursive
```

Pour tirer les dernières révisions distantes (à utiliser en connaissance de cause) :

```bash
git submodule update --remote --recursive
```

N’oublie pas ensuite de committer les pointeurs de submodules mis à jour.

## abtest-solution

Depuis `hackathon-abtest/abtest-solution` :

```bash
npm install
```

### Submodule campagnes / segments

```bash
git submodule update --init abtest-campaigns-segments
```

Pour mettre à jour le contenu après un changement dans le dépôt des campagnes :

```bash
git submodule update --init --remote abtest-campaigns-segments
```

Puis committer le nouveau pointeur de submodule dans `abtest-solution`.

### Démarrer les services

Les scripts exacts peuvent évoluer ; un scénario typique est de lancer l’API, le remote et l’UI. Consulte la section `scripts` des `package.json` dans `apps/*`. Exemple :

```bash
npm run dev
```

Voir aussi [Architecture](architecture.md) pour les ports et variables d’environnement.

## Documentation (ce site)

```bash
cd abtest-docs
pip install -r requirements.txt
mkdocs serve
```

Build de production : `mkdocs build` (sortie dans `site/`).
