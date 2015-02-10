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

// Spider
var spider = sandcrawler.spider('MySpider')
  .use(dashboard())
  .beforeScraping(function(req, next) {
    setTimeout(next, Math.random() * 1000);
  })
  .urls(_.range(50 - 1).map(function(i) {
    return 'http://localhost:1337/basic.html?' + (i + 1);
  }))
  .scraper(function($, done) {
    return done(null, {hello: 'world'});
  });

// Listening
var server = app.listen(1337);

sandcrawler.run(spider, function(err) {
  server.close();
});
