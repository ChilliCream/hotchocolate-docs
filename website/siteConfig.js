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
  url: "http://hotchocolate.io",
  cname: "hotchocolate.io",
  baseUrl: "/",
  gaTrackingId: "UA-72800164-3",
  projectName: "hotchocolate-docs",
  organizationName: "chillicream",
  repoUrl,
  headerLinks: [
    { doc: "installation", label: "Docs" },
    { doc: "example-break", label: "Examples" },
    { blog: true, label: "Blog" },
    { search: true },
    { href: repoUrl, label: "GitHub" }
  ],
  headerIcon: "img/signet.svg",
  footerIcon: "img/signet.svg",
  favicon: "img/favicon.png",
  colors: {
    primaryColor: "#29303a",
    secondaryColor: "#363f4c"
  },
  copyright: "Copyright © " + new Date().getFullYear() + " ChilliCream",
  editUrl: "https://github.com/ChilliCream/hotchocolate-docs/edit/master/docs/",
  /*algolia: {
    apiKey: "bf33c17016c2932f4993e27c5d3aba72",
    indexName: "hotchocolate"
  },*/
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: "androidstudio"
  },
  scripts: ["https://buttons.github.io/buttons.js"],
  onPageNav: "separate"
};

module.exports = siteConfig;