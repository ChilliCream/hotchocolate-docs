/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const siteConfig = require(`${CWD}/siteConfig.js`);
const versions = require(`${CWD}/versions.json`);

function Versions() {
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.realProjectName}`;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <h3 id="latest">Current version (Stable)</h3>
          <p>Latest version of {siteConfig.title}.</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a href="/docs/introduction">Documentation</a>
                </td>
                <td>
                  <a href={`https://github.com/${siteConfig.organizationName}/${siteConfig.realProjectName}/releases/tag/${latestVersion}`}>Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">Latest Version</h3>
          <p>Here you can find the latest documentation and unreleased code.</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>master</th>
                <td>
                  <a href="/docs/next/introduction">Documentation</a>
                </td>
                <td>
                  <a href={repoUrl}>Source Code</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="archive">Past Versions</h3>
          <p>Here you can find documentation for previous versions of {siteConfig.title}.</p>
          <table className="versions">
            <tbody>
              {versions.map(
                version =>
                  version !== latestVersion && (
                    <tr>
                      <th>{version}</th>
                      <td>
                        <a href={`/docs/${version}/introduction`}>Documentation</a>
                      </td>
                      <td>
                        <a href={`https://github.com/${siteConfig.organizationName}/${siteConfig.realProjectName}/releases/tag/${version}`}>Release Notes</a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on <a href={repoUrl}>GitHub</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Versions;
