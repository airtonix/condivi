var path = require('path');
var log = require('debug')('kss/handlebars/helpers/manifest');
var CWD = process.cwd();

var pkg = require(path.join(CWD, 'package.json'));

module.exports.register = function (Handlebars) {
  'use strict';
  var manifestPath = `${process.cwd()}/project/server/${pkg.name}/Static/theme/manifest.json`;

  var manifest;
  var errorMessage;
  var filecontent;

  try {
    log('asseturl.load', manifestPath);

    manifest = require(manifestPath);
  } catch (e) {
    log('assetUrl.missingManifest: ', manifestPath);
  }

  // {{ asseturl '/static/theme/foo.js' }}
  Handlebars.registerHelper('asseturl', function (filepath) {
    if (!manifest) {
      log(`asseturl.noManifest(${manifestPath})`)
      return filepath;
    }

    if (manifest[filepath]) {
      return manifest[filepath];
    } else {
      return filepath;
    }
  });
};
