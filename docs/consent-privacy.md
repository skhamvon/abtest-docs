# Consentement cookies et `privacyMode` des campagnes

Fichier racine **`consent-config.json`** (exemple fourni dans le dépôt `abtest-campaigns-segments`) :

```json
{
  "acceptanceCookie": {
    "name": "analytics_consent",
    "value": "granted"
  }
}
```

## Comportement

- Si `acceptanceCookie.name` est **vide** ou le fichier est **absent**, le moteur **n’applique pas** de garde-fou (comportement historique).
- Sinon, pour les campagnes en **`privacyMode`: `measurement`** (défaut si le champ est omis), l’API `/api/evaluate` exige que `context.cookies[name] === value` (égalité stricte). Sinon : réponse avec `reason: "consent_required"` et la **variation contrôle** (sans tracking).
- Les campagnes **`privacyMode`: `technical`** restent évaluées **sans** consentement ; le moteur **n’enregistre pas** d’exposition (`trackExposure`) et le remote **ne pose pas** de cookie d’assignation pour ces campagnes.

Variables d’environnement côté API (prioritaires sur le fichier) : `ABTEST_CONSENT_COOKIE_NAME`, `ABTEST_CONSENT_COOKIE_VALUE`.

`GET /api/consent-config` indique si le garde-fou est actif et expose le couple nom/valeur attendu (pour brancher une CMP côté front).

Exemple de campagne technique : `Campaigns/DemoTechnicalPatch/config.json` dans le dépôt campagnes/segments.

Pour le contexte navigateur et les cookies envoyés à l’évaluation, voir [Intégration hôte (remote)](integration-host.md).
