/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible

const repoUrl = "https://github.com/ChilliCream/hotchocolate";

const siteConfig = {
  title: "Hot Chocolate",
  tagline: "A GraphQL Server for .net core and .net classic",
  url: "https://hotchocolate.io",
  cname: "hotchocolate.io",
  baseUrl: "/",
  gaTrackingId: "UA-72800164-3",
  projectName: "hotchocolate-docs",
  organizationName: "chillicream",
  repoUrl,
  headerLinks: [{
      doc: "introduction",
      label: "Docs"
    },
    {
      doc: "example-star-wars-code-first",
      label: "Examples"
    },
    {
      blog: true,
      label: "Blog"
    },
    //{ search: false },
    {
      href: repoUrl,
      label: "GitHub"
    }
  ],
  headerIcon: "img/signet.svg",
  footerIcon: "img/signet.svg",
  favicon: "img/favicon.png",
  colors: {
    primaryColor: "#a28036",
    secondaryColor: "#a28036"
  },
  stylesheets: ["https://fonts.googleapis.com/css?family=Lobster:700,400"],
  copyright: "Copyright © " + new Date().getFullYear() + " ChilliCream",
  editUrl: "https://github.com/ChilliCream/hotchocolate-docs/edit/master/docs/",
  /*algolia: {
    apiKey: "bf33c17016c2932f4993e27c5d3aba72",
    indexName: "hotchocolate"
  },*/
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "atelier-dune-light"
  },
  scripts: ["https://buttons.github.io/buttons.js"],
  onPageNav: "separate",
  cleanUrl: true
};

module.exports = siteConfig;