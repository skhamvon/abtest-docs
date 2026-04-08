# Intégration hôte (remote)

Le dépôt `abtest-solution` expose un **remote / module fédéré** que n’importe quel site hôte peut consommer (le dépôt `small-webserver` du hackathon n’est qu’un exemple d’intégration de test).

## Déploiement du remote

1. Builder et déployer la partie « remote » de `abtest-solution` (par exemple sur une URL publique du type `https://cdn.example.com/abtest-remote/`).
2. Cette URL de base est utilisée par ton site hôte pour charger dynamiquement le bundle du remote.

## Côté application hôte

- Configurer le build front (Webpack ou Vite) pour charger le remote via **Module Federation** en lui donnant l’URL du remote déployé.
- Une fois chargé, tu peux appeler l’API JS exposée par le remote pour **évaluer une campagne** et récupérer la variante à afficher, ou monter un **composant React** fourni par le remote dans ta page.

En résumé : déployer le remote sur une URL stable, configurer le build front pour le charger via Module Federation, utiliser l’API ou les composants du remote pour afficher les variantes A/B.

## Contexte navigateur et cookies

Le remote construit le **contexte** envoyé à `/api/evaluate` (voir [Référence segments](segments-reference.md)), notamment :

- `cookies` — utile pour le consentement analytics configuré dans `consent-config.json` et pour des règles de type `cookie` ;
- `visitorType` (`new` / `returning`), en pratique aligné sur un cookie démo du type `abtest_returning` géré par le remote.

Les segments « nouveau / retour » s’appuient sur `visitorType`. Pour le détail du consentement et du `privacyMode`, voir [Consentement & confidentialité](consent-privacy.md).
