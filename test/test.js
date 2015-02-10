/**
 * Sandcrawler Dashboard Test
 * ===========================
 *
 * Actual dashboard test.
 */
var express = require('express'),
    sandcrawler = require('sandcrawler'),
    dashboard = require('../index.js'),
    _ = require('lodash');

// Server
var app = express();
app.use('/', express.static(__dirname));

// Helpers
function randomInt(x, y) {
  return Math.floor(Math.random() * y) + x;
}

// Spider
var spider = sandcrawler.spider()
  .use(dashboard())
  .beforeScraping(function(req, next) {
    setTimeout(next, randomInt(1, 2) * 1000);
  })
  .urls(_.range(10 - 1).map(function() {
    return 'http://localhost:1337/basic.html';
  }))
  .scraper(function($, done) {
    return done(null, {hello: 'world'});
  });

// Listening
var server = app.listen(1337);

sandcrawler.run(spider, function(err) {
  server.close();
});
