
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */
var navigator = global.navigator;
var process = global.process;
var namespace = 'cuid',
  c = 0,
  blockSize = 4,
  base = 36,
  discreteValues = Math.pow(base, blockSize),

  pad = function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
  },

  randomBlock = function randomBlock() {
    return pad((Math.random() *
      discreteValues << 0)
      .toString(base), blockSize);
  },

  api = function cuid() {
    // Starting with a lowercase letter makes
    // it HTML element ID friendly.
    var letter = 'c', // hard-coded allows for sequential access

      // timestamp
      // warning: this exposes the exact date and time
      // that the uid was created.
      timestamp = (new Date().getTime()).toString(base),

      // Prevent same-machine collisions.
      counter,

      // A few chars to generate distinct ids for different
      // clients (so different computers are far less
      // likely to generate the same id)
      fingerprint = api.fingerprint(),

      // Grab some more chars from Math.random()
      random = randomBlock() + randomBlock();

    c = (c < discreteValues) ? c : 0;
    counter = pad(c.toString(base), blockSize);

    c++; // this is not subliminal

    return (letter + timestamp + counter + fingerprint + random);
  };


  api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
      var i,
        count = 0;

      for (i in (global.window || global.process)) {
        count++;
      }

      return count;
    }());

    api.globalCount = function () { return cache; };
    return cache;
  };

  api.fingerprint = function () {
    var identifiers = [
      navigator && navigator.mimeTypes.length,
      navigator && navigator.userAgent.length,
      process & process.platform,
      process & process.ppid,
      process & process.release,
      process & process.version,
    ].filter(id => id).join('');


    return pad(
      identifiers.toString(36) +
      api.globalCount().toString(36), 4);
  };


module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('cuid', api);
}
