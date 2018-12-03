// math
// --------------------------------------------------------------------------
// Simple helper to use math operator

module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('math', function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      '+': lvalue + rvalue,
      '-': lvalue - rvalue,
      '*': lvalue * rvalue,
      '/': lvalue / rvalue,
      '%': lvalue % rvalue
    }[operator];
  });

  Handlebars.registerHelper('random', function (min, max) {
    var upper = max || 100;
    var lower = min || 1;
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  });
};
