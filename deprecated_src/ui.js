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
  table.jobs = {};

  table.add = function(id, rows) {
    this.jobs[id] = rows;
    return this;
  };

  table.remove = function(id) {
    delete this.jobs[id];

    return this;
  };

  table.find = function(id) {
    return this.jobs[id];
  };

  table.update = function() {
    var data = _.values(this.jobs);

    this.setData({
      headers: ['', 'Url', 'Error'],
      data: data
    });

    this.rows.select(data.length - 1);
  };

  // Getting my style
  table.rows.style.selected.bg = undefined;
  table.rows.style.selected.fg = 'white';

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
