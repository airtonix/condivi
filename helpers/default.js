var asArray = require('./collection').asArray;


module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('default', function () {
    var choices = asArray(arguments);
    var found;
    while (!found) {
      found = choices.shift();
    }
    return found;
  });
}
