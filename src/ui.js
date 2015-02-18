/**
 * Sandcrawler Dashboard UI
 * =========================
 *
 * Defining the blessed UI used by the plugin.
 */
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    _ = require('lodash');

function UI() {

  var screen = blessed.screen();

  // Log component
  this.log = blessed.box({
    label: 'Log',
    top: '0',
    left: '0',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '60%',
    height: '70%',
    wrap: true
  });
  this.log.lines = [];

  // Request component
  this.request = blessed.box({
    label: 'Request',
    top: '70%',
    left: '0',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '30%',
    height: '30%'
  });

  // Response component
  this.response = blessed.box({
    label: 'Response',
    top: '70%',
    left: '30%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '30%',
    height: '30%'
  });

  // Job table component
  var table = contrib.table({
    label: 'Jobs',
    top: '0',
    left: '60%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '40%',
    height: '60%',
    columnSpacing: [6, 70, 20]
  });
  table.jobs = [];

  table.find = function(id) {
    return _.find(table.jobs, {id: id});
  };

  table.update = function() {
    table.setData({
      headers: ['', 'Url', 'Error'],
      data: _.map(table.jobs, 'rows')
    });

    if (table.current === table.jobs.length - 2) {
      table.rows.select(table.jobs.length - 1);
      table.current = table.jobs.length - 1;
    }
  };

  // Getting my style
  table.rows.style.selected.bg = undefined;
  table.rows.style.selected.fg = 'white';

  // Stalking hover in an awkward way...
  table.current = 0;

  table.rows.on('key up', function() {
    table.current = Math.max(0, table.current - 1);
  });

  table.rows.on('key down', function() {
    table.current = Math.min(table.jobs.length - 1, table.current + 1);
  });

  table.focus();
  this.jobTable = table;

  // Gauge component
  this.progressBar = blessed.ProgressBar({
    label: 'Progress - 0%',
    top: '60%',
    left: '60%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '40%',
    height: '10%',
    barBg: 'blue'
  });

  // Stats component
  this.stats = blessed.box({
    label: 'Stats',
    top: '70%',
    left: '60%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '20%',
    height: '30%'
  });

  this.info = blessed.box({
    label: 'Information',
    top: '70%',
    left: '80%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '20%',
    height: '30%'
  });

  // Rendering the UI
  screen.append(this.log);
  screen.append(this.request);
  screen.append(this.response);
  screen.append(this.jobTable);
  screen.append(this.progressBar);
  screen.append(this.stats);
  screen.append(this.info);
  screen.render();

  // Getting out of the dashboard (might get useful...)
  screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
  });

  this.screen = screen;
}

module.exports = UI;
