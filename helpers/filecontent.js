
var path = require('path');
var fs = require('fs');
var log = require('debug')('styleguide/handlebars/helpers/filecontent');

module.exports.register = function (Handlebars) {
  'use strict';

  // Fonction `filecontent` : Lit un fichier et renvoit sont contenu sous forme de string
  Handlebars.registerHelper('filecontent', function (filepath) {
    var filefullpath = path.join('/opt/app', filepath);
    var errorMessage = 'filecontent("' + filefullpath + '") File not found'
    var filecontent = '<!-- ' + errorMessage + ' -->';
    try {
      filecontent = fs.readFileSync(filefullpath).toString();
    } catch (e) {
      log('HTML warning: ' + errorMessage);
    }
    return filecontent;
  });
};
