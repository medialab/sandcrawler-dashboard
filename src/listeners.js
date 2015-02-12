/**
 * Sandcrawler Dashboard Listeners
 * ================================
 *
 * Hooking on the spider to relay information through the dahsboard's UI.
 */
var logger = require('sandcrawler-logger'),
    throttle = require('lodash.throttle'),
    util = require('util');

module.exports = function(spider, ui) {

  function render() {
    return ui.screen.render();
  }

  // Branching the logger
  spider.use(logger({
    out: function(txt) {
      var lines = ui.log.lines;
      lines.push(txt);

      if (lines.length > ui.log.height - 2)
        lines.shift();

      ui.log.setItems(lines);
      render();
    }
  }));

  // On end
  spider.once('spider:end', function() {
    setTimeout(function() {
      spider.logger.info('Press Ctrl-c to exit...');
    }, 10);
  });

  // Sample data display
  spider.on('job:success', throttle(function(job) {

    ui.dataSample.setContent(util.inspect(job.res.data, {depth: 1}));
    render();
  }, 2000));

  // Progress bar
  spider.on('job:end', function() {
    var completion = spider.stats.completion;

    ui.progressBar.setProgress(completion);
    ui.progressBar.setLabel('Progress - ' + completion + '%');
    render();
  });
};
