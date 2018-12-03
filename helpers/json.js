// json(path)
// --------------------------------------------------------------------------
// Lit le fichier JSON en paramètre et renvoie l'objet correspondant
//
// Pour le paramètre `path`, le dossier courrant `./` est le dossier source
// des données des gabarits Twig: `src/data` par defaut.

var fs    = require('fs');
var path  = require('path');
var log = require('debug')('styleguide/handlebars/helpers/json');

module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('json', function (varname, file) {
    var data = {};

    var fullpath = path.resolve('/opt/app/', file);

    try {
      data = JSON.parse(fs.readFileSync(fullpath, 'utf8'));
    } catch (e) {
      log('Unable to find data from: ', fullpath.replace(path.resolve('.'), '').slice(1));
    }

    this[varname] = data;
  });
};
