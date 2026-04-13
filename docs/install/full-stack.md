# Installer le projet dans sa totalité

Installe le dépôt **hackathon-abtest** avec **tous les submodules** : `small-webserver`, `abtest-solution` (dont `abtest-campaigns-segments`), `abtest-docs`.

## Prérequis

- **Git**
- **Node.js 20+** et `npm`

## Étapes

### 1. Cloner et initialiser les submodules

```bash
git clone git@github.com:skhamvon/hackathon-abtest.git
cd hackathon-abtest
git submodule update --init --recursive
```

### 2. Lancer selon le besoin

- **Solution A/B test** : [Installer la solution d’A/B test](./abtest-solution.md)
- **Serveur web de test** : [Installer le web serveur de test](./webserver.md)
- **Documentation locale** :

```bash
cd abtest-docs
npm install
npm run docs:dev
```

### 3. Mettre à jour les submodules plus tard

```bash
cd hackathon-abtest
git submodule update --init --recursive
```

Avec prudence : `git submodule update --remote --recursive` puis commit des pointeurs.

## Références

- [Submodules Git](../reference/submodules.md)
- [Ports et variables d’environnement](../reference/ports-and-env.md)
