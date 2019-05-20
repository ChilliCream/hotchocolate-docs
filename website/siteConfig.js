/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible

const repoUrl = "https://github.com/ChilliCream/hotchocolate";
const organizationUrl = "https://chillicream.com";
const blogUrl = organizationUrl + "/blog";

const siteConfig = {
  title: "Hot Chocolate",
  tagline: "A GraphQL Server for .net core and .net classic",
  url: "https://hotchocolate.io",
  cname: "hotchocolate.io",
  usePrism: true,
  baseUrl: "/",
  blogUrl,
  repoUrl,
  gaTrackingId: "UA-72800164-3",
  projectName: "hotchocolate-docs",
  realProjectName: "hotchocolate",
  organizationName: "chillicream",
  organizationTitle: "ChilliCream",
  organizationUrl,
  headerLinks: [
    {
      doc: "introduction",
      href: "/docs",
      label: "Docs"
    },
    {
      doc: "example-star-wars-code-first",
      label: "Examples"
    },
    {
      href: blogUrl,
      label: "Blog",
      external: true
    },
    {
      href: repoUrl,
      label: "GitHub",
      external: true
    },
    { search: false }
  ],
  headerIcon: "img/signet.svg",
  footerIcon: "img/signet.svg",
  favicon: "img/favicon.png",
  colors: {
    primaryColor: "#a28036",
    secondaryColor: "#a28036"
  },
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Lobster:700,400",
    "/css/code-block-buttons.css"
  ],
  copyright: `Copyright © ${new Date().getFullYear()}`,
  editUrl: "https://github.com/ChilliCream/hotchocolate-docs/edit/master/docs/",
  algolia: {
    apiKey: "47d61652587888cd5144dcdd6fb9117b",
    indexName: "hotchocolate",
    algoliaOptions: {
      facetFilters: ["language:LANGUAGE", "version:VERSION"]
    }
  },
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "monokai-sublime"
  },
  scripts: [
    "https://buttons.github.io/buttons.js",
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js",
    "/js/code-block-buttons.js"
  ],
  onPageNav: "separate",
  docsSideNavCollapsible: true,
  twitter: true,
  twitterUsername: "Chilli_Cream",
  twitterImage: "img/cupcake.png",
  cleanUrl: true,
  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100
  },
  enableUpdateTime: true,
  enableUpdateBy: true,
  slackInvite:
    "https://join.slack.com/t/hotchocolategraphql/shared_invite/enQtNTA4NjA0ODYwOTQ0LTBkZjNjZWIzMmNlZjQ5MDQyNDNjMmY3NzYzZjgyYTVmZDU2YjVmNDlhNjNlNTk2ZWRiYzIxMTkwYzA4ODA5Yzg"
};

module.exports = siteConfig;
