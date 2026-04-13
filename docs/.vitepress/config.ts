import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Documentation A/B testing",
  description:
    "Hackathon A/B test : solution, serveur de labo, campagnes, segments, consentement.",
  base: "/abtest-docs/",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Introduction", link: "/" },
      { text: "Installation", link: "/install/full-stack" },
      { text: "Serveur web de test", link: "/webserver/intro" },
      { text: "Solution A/B test", link: "/solution/intro" },
      { text: "Référence", link: "/reference/ports-and-env" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Vue d'ensemble", link: "/" },
          { text: "Description des dépôts", link: "/intro/repositories" },
        ],
      },
      {
        text: "Comment installer",
        collapsed: false,
        items: [
          { text: "Projet complet (hackathon)", link: "/install/full-stack" },
          { text: "Solution d'A/B test", link: "/install/abtest-solution" },
          { text: "Web serveur de test", link: "/install/webserver" },
        ],
      },
      {
        text: "Serveur web de test",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/webserver/intro" },
          { text: "Pages et URLs", link: "/webserver/pages-and-urls" },
          { text: "Limitation de débit (throttle)", link: "/webserver/network-throttle" },
          { text: "Développement et build", link: "/webserver/development" },
        ],
      },
      {
        text: "Solution d'A/B test",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/solution/intro" },
          { text: "Module Federation & hôte", link: "/solution/module-federation" },
          { text: "Consentement", link: "/solution/consent" },
          {
            text: "Campagnes et segments",
            collapsed: false,
            items: [
              { text: "Vue d'ensemble", link: "/solution/campaigns-segments/" },
              {
                text: "Campagnes",
                collapsed: false,
                items: [
                  {
                    text: "Configuration et variantes",
                    link: "/solution/campaigns-segments/campaigns",
                  },
                ],
              },
              {
                text: "Segments",
                collapsed: false,
                items: [
                  {
                    text: "Règles et contexte",
                    link: "/solution/campaigns-segments/segments",
                  },
                  {
                    text: "Conditions de segment (ET / OU / NON)",
                    link: "/solution/campaigns-segments/segment-conditions",
                  },
                  {
                    text: "Types de segment",
                    link: "/solution/campaigns-segments/segment-types",
                  },
                ],
              },
              {
                text: "CLI : squelettes (IDE)",
                link: "/solution/campaigns-segments/scaffold-cli",
              },
            ],
          },
        ],
      },
      {
        text: "Référence",
        collapsed: false,
        items: [
          { text: "Ports et variables", link: "/reference/ports-and-env" },
          { text: "Submodules Git", link: "/reference/submodules" },
          { text: "Aperçu de l'API", link: "/reference/api-overview" },
          { text: "Dépannage", link: "/reference/troubleshooting" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/skhamvon/abtest-docs" },
    ],
    search: { provider: "local" },
  },
});
