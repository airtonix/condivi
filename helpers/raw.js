module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('raw', function (options) {
    return options.fn();
  });
};
