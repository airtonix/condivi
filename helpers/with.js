
var isObject = module.exports.isObject = function (val) {
  return !!val && (val.constructor === Object || isObjectString(val.constructor))
}

var isObjectString = module.exports.isObjectString = function (val) {
  return !!val && isFunction(val) && toString(val) === objString
}

var toString = module.exports.toString = function (val) {
  return Function.prototype.toString.call(val)
}

var isFunction = module.exports.isFunction = function (value) {
  return typeof value === 'function'
}


module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('frame', function (context, options) {
    if (isObject(context) && context.hash) {
      options = context;
      context = options.data;
    }

    const frame = Handlebars.createFrame(context);

    if (!isObject(options)) {
      options = {};
    }

    // extend the frame with hash arguments
    return options.fn(this, {
      data: Object.assign({}, frame, options.hash || {})
    });
  });
}
