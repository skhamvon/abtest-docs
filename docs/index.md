# Documentation A/B testing

Bienvenue. Cette documentation couvre :

- l’**architecture** de la solution (`abtest-solution`) ;
- le dépôt **données** campagnes et segments (`abtest-campaigns-segments`) ;
- le **consentement** cookies, le `privacyMode` des campagnes et l’API associée ;
- la **référence** des règles de ciblage (segments) ;
- l’**intégration** hôte (remote / contexte navigateur) ;
- le **développement** local (submodules, ports).

## Dépôts associés

| Dépôt                                                                              | Rôle                                                                  |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [hackathon-abtest](https://github.com/skhamvon/hackathon-abtest)                   | Point d’entrée avec submodules (dont cette doc et `abtest-solution`). |
| [abtest-solution](https://github.com/skhamvon/abtest-solution)                     | API, UI admin, remote, moteur `@abtest-solution/core`.                |
| [abtest-campaigns-segments](https://github.com/skhamvon/abtest-campaigns-segments) | JSON campagnes/segments, assets front, `consent-config.json`.         |
| [abtest-docs](https://github.com/skhamvon/abtest-docs)                             | Ce site (sources Markdown).                                           |

Utilise le menu à gauche pour naviguer.
