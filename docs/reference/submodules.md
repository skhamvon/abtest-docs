# Submodules Git

## hackathon-abtest

```bash
git clone git@github.com:skhamvon/hackathon-abtest.git
cd hackathon-abtest
git submodule update --init --recursive
```

Le flag **`--recursive`** initialise aussi **`abtest-solution/abtest-campaigns-segments`**.

## abtest-solution → abtest-campaigns-segments

```bash
cd abtest-solution
git submodule update --init abtest-campaigns-segments
```

Mise à jour :

```bash
git submodule update --init --remote abtest-campaigns-segments
git add abtest-campaigns-segments
git commit -m "chore: update campaigns/segments submodule pointer"
```

Workflow : commit dans le dépôt campagnes → avancer le pointeur dans `abtest-solution` → push.

## Dépannage

- Dossiers vides : oubli de `--recursive` → `git submodule update --init --recursive`.
- `modified: abtest-solution` : changements **dans** le clone du submodule ; `cd abtest-solution && git status`.
