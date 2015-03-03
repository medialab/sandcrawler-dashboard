/**
 * Sandcrawler Dashboard Public Interface
 * =======================================
 *
 * Just a matter of exporting the plugin function. Not something very fancy
 * as you might notice.
 */
var UI = require('./src/ui.js'),
    listeners = require('./src/listeners.js'),
    defaults = require('./defaults.json'),
    _ = require('lodash');

module.exports = function(opts) {

  return function(spider) {
    var ui = new UI();

    return listeners(spider, ui, _.extend({}, defaults, opts));
  };
};
