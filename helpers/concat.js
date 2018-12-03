// concat
// --------------------------------------------------------------------------
// Simple helper to concat string
var asArray = require('./collection').asArray;

module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('concat', function (/* string1, string2, string3 */) {
    // if you provide several keys, they will be concatenated
    var tests = asArray(arguments);
    // remove options
    tests.splice(-1, 1);
    return tests.join('');
  });
};
