/**
 * Sandcrawler Dashboard Listeners
 * ================================
 *
 * Hooking on the spider to relay information through the dahsboard's UI.
 */
var logger = require('sandcrawler-logger'),
    chalk = require('chalk'),
    util = require('util'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = function(spider, ui) {

  function render() {
    updateInformation();
    return ui.screen.render();
  }

  function updateInformation() {
    var mostCommonError = _(spider.stats.errorIndex)
      .pairs()
      .max(function(p) {
        return p[1];
      })[0];

    ui.stats.setContent([
      chalk.grey.bold('Queued jobs      ') + spider.stats.queued,
      chalk.grey.bold('In-progress jobs ') + spider.stats.doing,
      chalk.grey.bold('Done jobs        ') + spider.stats.done,
      '',
      chalk.grey.bold('Successes        ') + spider.stats.successes,
      chalk.grey.bold('Failures         ') + spider.stats.failures,
      chalk.grey.bold('Success Rate     ') + spider.stats.successRate + '%',
    ].join('\n'));

    ui.info.setContent([
      chalk.grey.bold('Elapsed time      ') + moment({seconds: spider.stats.getElapsedTime()}).format('H:mm:ss'),
      chalk.grey.bold('Remaining time    ') + moment({seconds: spider.stats.getEstimatedTimeToCompletion()}).format('H:mm:ss'),
      chalk.grey.bold('Time per job      ') + moment({seconds: spider.stats.averageTimePerJob}).format('  mm:ss'),
      '',
      chalk.grey.bold('Engine type       ') + spider.type,
      chalk.grey.bold('Most common error ') + (mostCommonError ? chalk.red(mostCommonError) : '-')
    ].join('\n'));
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
  spider.on('job:success', _.throttle(function(job) {

    ui.dataSample.setContent(util.inspect(job.res.data, {depth: 1}));
    render();
  }, 2000));

  // Progress bar & job table
  spider.on('job:start', function(job) {
    var j = ui.jobTable.find(job.id);

    if (j) {
      j.rows[0] = ' ' + chalk.bgBlue.bold.white(' ~ ') + ' ';
      j.rows[1] = chalk.bold.grey(job.req.url);
      j.rows[2] = chalk.bold.white('-');
    }
    else {
      ui.jobTable.jobs.push({
        id: job.id,
          rows: [
          ' ' + chalk.bgBlue.bold.white(' ~ ') + ' ',
          chalk.bold.grey(job.req.url),
          chalk.bold.white('-')
        ]
      });
    }

    ui.jobTable.update();
    render();
  });

  spider.on('job:success', function(job) {
    var j = ui.jobTable.find(job.id);

    j.rows[0] = ' ' + chalk.bgGreen.bold.white(' ✔ ') + ' ';

    ui.jobTable.update();
    render();
  });

  spider.on('job:fail', function(err, job) {
    var j = ui.jobTable.find(job.id);

    j.rows[0] = ' ' + chalk.bgRed.bold.white(' ✖ ') + ' ';
    j.rows[2] = chalk.red(err.message);

    ui.jobTable.update();
    render();
  });

  spider.on('job:end', function() {
    var completion = spider.stats.completion;

    ui.progressBar.setProgress(completion);
    ui.progressBar.setLabel('Progress - ' + completion + '%');
    render();
  });
};
