/**
 * Sandcrawler Dashboard Listeners
 * ================================
 *
 * Hooking on the spider to relay information through the dahsboard's UI.
 */
var logger = require('sandcrawler-logger'),
    blessed = require('blessed'),
    chalk = require('chalk'),
    util = require('util'),
    url = require('url'),
    _ = require('lodash');

// Helpers
function pad(nb) {
  var nbstr = '' + nb;

  if (nbstr.length < 2)
    return '0' + nb;
  return nbstr;
}

function formatHMS(seconds) {
  var hours = (seconds / 3600) | 0,
      minutes = (seconds / 60) | 0,
      seconds = seconds % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

function formatMS(seconds) {
  var minutes = (seconds / 60) | 0,
      seconds = seconds % 60;
  return pad(minutes) + ':' + pad(seconds);
}

// Exporting listeners
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
      chalk.grey.bold('Elapsed time      ') + formatHMS(spider.stats.getElapsedTime()),
      chalk.grey.bold('Remaining time    ') + formatHMS(spider.stats.getRemainingTimeEstimation()),
      chalk.grey.bold('Time per job      ') + '   ' + formatMS(spider.stats.averageTimePerJob),
      '',
      chalk.grey.bold('Engine type       ') + spider.type,
      chalk.grey.bold('Most common error ') + (mostCommonError ? chalk.red(mostCommonError) : '-')
    ].join('\n'));
  }

  // Branching the logger
  spider.use(logger({
    out: function(txt) {
      var lines = ui.log.lines,
          wrapped = ui.log._wrapContent(txt, ui.log.width - 2);

      wrapped.forEach(function(line) {
        lines.unshift(line);
      });

      lines = lines.slice(0, ui.log.height - 2);

      ui.log.setContent(lines.reverse().join('\n'));
      render();
    }
  }));

  // On end
  spider.once('spider:teardown', function() {
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

    var truncatedUrl = job.req.url.slice(-45);

    if (truncatedUrl.length !== job.req.url.length) {
      var parsed = url.parse(job.req.url),
          root = parsed.protocol + parsed.host;

      if (root.length > 40) {
        truncatedUrl = root.slice(-43) + '...';
      }
      else {
        truncatedUrl = (root + '/../' + _.last(parsed.path.split('/')));

        if (truncatedUrl.length > 45)
          truncatedUrl = root + '/../..';
      }
    }

    if (j) {
      j.rows[0] = ' ' + chalk.bgBlue.bold.white(' ~ ') + ' ';
      j.rows[1] = chalk.bold.grey(truncatedUrl);
      j.rows[2] = chalk.bold.white('-');
    }
    else {
      ui.jobTable.jobs.push({
        id: job.id,
          rows: [
          ' ' + chalk.bgBlue.bold.white(' ~ ') + ' ',
          chalk.bold.grey(truncatedUrl),
          chalk.bold.white('-')
        ]
      });
    }

    ui.jobTable.update();
    render();
  });

  spider.on('job:success', function(job) {
    var j = ui.jobTable.find(job.id);

    j.rows[0] = ' ' + chalk.bgGreen.bold.white(' ✓ ') + ' ';

    ui.jobTable.update();
    render();
  });

  spider.on('job:fail', function(err, job) {
    var j = ui.jobTable.find(job.id),
        errMessage = err.message;

    if (errMessage.length > 12)
      errMessage = errMessage.slice(0, 9) + '...';

    j.rows[0] = ' ' + chalk.bgRed.bold.white(' ✗ ') + ' ';
    j.rows[2] = chalk.red(errMessage);

    ui.jobTable.update();
    render();
  });

  function updateCompletion() {
    var completion = spider.stats.completion;

    ui.progressBar.setProgress(completion);
    ui.progressBar.setLabel('Progress - ' + completion + '%');
    render();
  }

  spider.on('job:add', updateCompletion);
  spider.on('job:end', updateCompletion);
};
