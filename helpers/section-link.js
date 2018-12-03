// concat
// --------------------------------------------------------------------------
// Simple helper to concat string
module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('section-link', function (text, reference) {
    // if you provide several keys, they will be concatenated
      return `<a href="${reference}">${text}</a>`;
  });
};
