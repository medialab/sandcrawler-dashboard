/**
 * Sandcrawler Dashboard Plugin
 * =============================
 *
 * Displays a handy dashboard for the spider using it.
 */
var util = require('util'),
    blessed = require('blessed'),
    logger = require('sandcrawler-logger');

module.exports = function(opts) {

  return function(spider) {

    // Building the UI
    var screen = blessed.screen();

    // Log component
    var logComponent = blessed.list({
      label: 'Log',
      top: '0',
      left: '0',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      width: '60%',
      height: '70%',
      interactive: false
    });
    logComponent.logLines = [];

    // Data sample component
    var dataSampleComponent = blessed.box({
      label: 'Data Sample',
      top: '70%',
      left: '0',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      width: '60%',
      height: '30%'
    });

    // Job table component
    var jobTableComponent = blessed.box({
      label: 'Jobs',
      top: '0',
      left: '60%',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      width: '40%',
      height: '40%'
    });

    // Gauge component
    var progressBarComponent = blessed.ProgressBar({
      label: 'Progress - 0%',
      top: '40%',
      left: '60%',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      width: '40%',
      height: '10%',
      barBg: 'blue'
    });

    // Stats component
    var statsComponent = blessed.box({
      label: 'Stats',
      top: '50%',
      left: '60%',
      border: {
        type: 'line',
        fg: 'cyan'
      },
      width: '40%',
      height: '50%'
    });

    // Rendering the UI
    screen.append(logComponent);
    screen.append(dataSampleComponent);
    screen.append(jobTableComponent);
    screen.append(progressBarComponent);
    screen.append(statsComponent);
    screen.render();

    // Getting out of the dashboard (might get useful...)
    screen.key(['C-c'], function(ch, key) {
      return process.exit(0);
    });

    // Branching the logger
    spider.use(logger({
      out: function(txt) {
        var lines = logComponent.logLines;
        lines.push(txt);

        if (lines.length > logComponent.height - 2)
          lines.shift();

        logComponent.setItems(lines);
        screen.render();
      }
    }));

    // On end
    spider.once('spider:end', function() {
      setTimeout(function() {
        spider.logger.info('Press Ctrl-c to exit...');
      }, 10);
    });

    // Sample data display
    spider.on('job:success', function(job) {

      dataSampleComponent.setContent(util.inspect(job.res.data, {depth: 1}));
      screen.render();
    });

    // Progress bar
    spider.on('job:end', function() {
      var completion = spider.stats.completion;

      progressBarComponent.setProgress(completion);
      progressBarComponent.setLabel('Progress - ' + completion + '%');
      screen.render();
    });
  };
};
