/**
 * Sandcrawler Dashboard Public Interface
 * =======================================
 *
 * Just a matter of exporting the plugin function. Not something very fancy
 * as you might notice.
 */
import app from './src/app.jsx';
import defaults from './defaults.json';
import _ from 'lodash';

export default function(opts) {
  return function(spider) {
    return app(spider, _.extend({}, defaults, opts));
  };
};
