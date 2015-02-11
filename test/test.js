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
  .urls(_.range(30).map(function(i) {
    return 'http://localhost:3002/basic.html?' + (i + 1);
  }))
  .scraper(function($, done) {
    if (Math.random() > 0.5)
      return done(null, {hello: 'world'});
    else
      return done(null, $('.url-list a').scrape('href'));
  });

// Listening
var server = app.listen(3002);

sandcrawler.run(spider, function(err) {
  server.close();
});
