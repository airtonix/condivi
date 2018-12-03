// concat
// --------------------------------------------------------------------------
// Simple helper to concat string
var marked = require('marked');


module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('markdown', function (content, options) {
    // remove options
    if (options) {
      marked.setOptions(options);
    }
    return marked(content);
  });
};
