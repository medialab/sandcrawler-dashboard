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
    nodeUrl = require('url'),
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
      minutes = ((seconds - (hours * 3600)) / 60) | 0,
      seconds = Math.round(seconds) % 60;

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

function formatMS(seconds) {
  var minutes = (seconds / 60) | 0,
      seconds = Math.round(seconds) % 60;
  return pad(minutes) + ':' + pad(seconds);
}

function formatUrl(url, pad) {
  pad = pad || 45;

  var truncatedUrl = url.slice(-pad);

  if (truncatedUrl.length !== url.length) {
    var parsed = nodeUrl.parse(url),
        root = parsed.protocol + '//' +  parsed.host;

    if (root.length > pad - 5) {
      truncatedUrl = root.slice(-pad - 2) + '...';
    }
    else {
      truncatedUrl = (root + '/../' + _.last(parsed.path.split('/')));

      if (truncatedUrl.length > pad)
        truncatedUrl = root + '/../..';
    }
  }

  return truncatedUrl;
}

// Exporting listeners
module.exports = function(spider, ui, opts) {

  function render() {
    updateInformation();
    return ui.screen.render();
  }

  // Rendering every now and then...
  var renderInterval = setInterval(render, 30);

  function updateInformation() {
    var errors = _(spider.stats.errorIndex)
      .pairs()
      .sortBy(function(p) {
        return -p[1];
      })
      .map(function(p) {
        return '  ' + chalk.red(p[0]) + ' ' + p[1];
      })
      .value();

    ui.stats.setContent([
      chalk.grey.bold('Queued jobs      ') + spider.stats.queued,
      chalk.grey.bold('In-progress jobs ') + spider.stats.doing,
      chalk.grey.bold('Done jobs        ') + spider.stats.done,
      '',
      chalk.grey.bold('Successes        ') + chalk.green(spider.stats.successes),
      chalk.grey.bold('Failures         ') + chalk.red(spider.stats.failures),
      chalk.grey.bold('Success Rate     ') + spider.stats.successRate + '%',
      '',
      chalk.grey.bold('Engine type      ') + spider.type,
      chalk.grey.bold('Concurrency      ') + spider.options.concurrency
    ].join('\n'));

    var elapsed = spider.stats.getElapsedTime(),
        estimate = spider.stats.getRemainingTimeEstimation(),
        average = spider.stats.averageTimePerJob;

    ui.info.setContent([
      chalk.grey.bold('Elapsed time      ') + formatHMS(elapsed),
      chalk.grey.bold('Remaining time    ') + (estimate ? formatHMS(estimate) : '       ~'),
      chalk.grey.bold('Time per job      ') + '   ' + (average ? formatMS(average) : '    ~'),
      chalk.grey.bold('Errors ')
    ].concat(errors).join('\n'));
  }

  // Branching the logger
  spider.use(logger(_.extend({
    out: function(txt) {
      var lines = ui.log.lines,
          wrapped = ui.log._wrapContent(txt, ui.log.width - 2);

      wrapped.forEach(function(line) {
        lines.unshift(line);
      });

      lines = lines.slice(0, ui.log.height - 2);

      ui.log.setContent(lines.reverse().join('\n'));

    }
  }, opts.logger)));

  // On end
  spider.once('spider:teardown', function() {
    clearInterval(renderInterval);
    setTimeout(function() {
      spider.logger.info('Press Ctrl-c to exit...');
      render();
    }, 10);
  });

  // Progress bar & job table
  spider.on('job:start', function(job) {
    var j = ui.jobTable.find(job.id);

    var truncatedUrl = formatUrl(job.req.url);

    if (j)
      ui.jobTable.remove(job.id);

    ui.jobTable.add(job.id, [
      ' ' + chalk.bgBlue.bold.white(' ~ ') + ' ',
      chalk.bold.grey(truncatedUrl),
      chalk.bold.white('-')
    ]);

    ui.jobTable.update();
  });

  spider.on('job:success', function(job) {
    var rows = ui.jobTable.find(job.id);

    rows[0] = ' ' + chalk.bgGreen.bold.white(' ✓ ') + ' ';
    rows[1] = chalk.bold.grey(formatUrl(job.res.url || job.req.url));

    ui.jobTable.update();
  });

  spider.on('job:retry', function(job) {
    var rows = ui.jobTable.find(job.id);

    rows[0] = ' ' + chalk.bgMagenta.bold.white(' · ') + ' ';

    ui.jobTable.update();
  });

  spider.on('job:discard', function(err, job) {
    var j = ui.jobTable.find(job.id);

    if (j)
      ui.jobTable.remove(job.id);
  });

  spider.on('job:fail', function(err, job) {
    var rows = ui.jobTable.find(job.id),
        errMessage = err.message;

    if (errMessage.length > 12)
      errMessage = errMessage.slice(0, 9) + '...';

    rows[0] = ' ' + chalk.bgRed.bold.white(' ✗ ') + ' ';
    rows[1] = chalk.bold.grey(formatUrl(job.res.url || job.req.url));
    rows[2] = chalk.red(errMessage);

    ui.jobTable.update();
  });

  function updateReqRes(err, job) {
    if (!job) {
      job = err;
      err = null;
    }

    // Request
    var reqText = '';
    reqText += chalk.grey.bold('Url') + ' ' + formatUrl(job.req.url, ui.request.width - 2 - 4) + '\n';

    _(job.req)
      .omit(['url', 'retry', 'retryNow', 'retryLater'])
      .forIn(function(v, k) {
        reqText += chalk.grey.bold(_.capitalize(k)) + ' ' + util.inspect(v, {depth: 1}) + '\n';
      })
      .value();

    ui.request.setContent(reqText);

    // Response
    var resText = '';

    resText += chalk.grey.bold('Url') + ' ' + formatUrl(job.res.url || job.req.url, ui.response.width - 2 - 4) + '\n';

    if (err)
      resText += chalk.red.bold('Error') + ' ' + (err.message || err) + '\n';

    resText += chalk[err ? 'grey' : 'green'].bold('Data') + ' ' + util.inspect(job.res.data, {depth: 1}) + '\n';

    _(job.res)
      .omit(['url', 'body', 'data', 'error'])
      .forIn(function(v, k) {
        resText += chalk.grey.bold(_.capitalize(k)) + ' ' + util.inspect(v, {depth: 1}) + '\n';
      })
      .value();

    ui.response.setContent(resText);
  };

  spider.on('job:success', updateReqRes);
  spider.on('job:fail', updateReqRes);

  function updateCompletion() {
    var completion = spider.stats.completion;

    ui.progressBar.setProgress(completion);
    ui.progressBar.setLabel('Progress - ' + completion + '%');
  }

  spider.on('job:add', updateCompletion);
  spider.on('job:end', updateCompletion);
};
