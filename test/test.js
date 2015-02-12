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

// Helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Server
var app = express();
app.use('/', express.static(__dirname));

// Spider
var spider = sandcrawler.spider('MySpider')
  .use(dashboard())
  .config({concurrency: 4})
  .beforeScraping(function(req, next) {
    setTimeout(next, randInt(2, 4) * 500);
  })
  .urls(_.range(40).map(function(i) {
    return 'http://localhost:3002/basic.html?' + (i + 1);
  }))
  .scraper(function($, done) {
    if (Math.random() > 0.5)
      return done(null, {hello: 'world'});
    else
      return done(null, $('.url-list a').scrape('href'));
  })
  .afterScraping(function(req, res, next) {
    var n = randInt(1, 8);

    if (n > 7)
      return next(new Error('invalid-data'));
    else
      return next();
  });

// Listening
var server = app.listen(3002);

sandcrawler.run(spider, function(err) {
  server.close();
});
