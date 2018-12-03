// concat
// --------------------------------------------------------------------------
// Simple helper to concat string

var asArray = module.exports.asArray = function  (collection) {
  var result = Array.prototype.splice.call(collection, 0);
  return result;
}

var sample = module.exports.sample = function (/* string1, string2, string3 */) {
  var source = asArray(arguments);
  var index = Math.floor(Math.random() * source.length) + 1
  // remove options
  var result = source[index] || source[0];
  return result || '';
}

var fill = module.exports.fill = function (count, filler) {
  return Array(count).fill(filler || ' ');
}

module.exports.register = function (Handlebars) {
  'use strict';
  Handlebars.registerHelper('sample', sample);
  Handlebars.registerHelper('fill', fill);
  Handlebars.registerHelper('asArray', asArray);
};
