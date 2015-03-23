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
  .config({concurrency: 4, maxRetries: 2, autoRetry: 'later'})
  .beforeScraping(function(req, next) {
    setTimeout(function() {
      var n = randInt(1, 10);

      if (n > 9)
        return next(new Error('discard'));
      else
        return next();
    }, randInt(2, 10) * 500);
  })
  .urls(_.range(50).map(function(i) {
    var n = randInt(1, 10);
    if (n > 5)
      return 'http://localhost:3002/basic/this/is/an-insupportably-long-and-inexistant/url/just-for-thesakeofitandbecauseI/can.tm';
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
  })
  .result(function(err, req) {
    // if (err)
    //   return req.retryLater();
  });

// Listening
var server = app.listen(3002);

sandcrawler.run(spider, function(err) {
  server.close();
});
