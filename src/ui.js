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
  this.log = blessed.list({
    label: 'Log',
    top: '0',
    left: '0',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '60%',
    height: '70%',
    interactive: false
  });
  this.log.lines = [];

  // Data sample component
  this.dataSample = blessed.box({
    label: 'Data Sample',
    top: '70%',
    left: '0',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '60%',
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
    height: '40%',
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
  table.rows.style.selected.fg = undefined;

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
    top: '40%',
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
    top: '50%',
    left: '60%',
    border: {
      type: 'line',
      fg: 'blue'
    },
    width: '40%',
    height: '50%'
  });

  // Rendering the UI
  screen.append(this.log);
  screen.append(this.dataSample);
  screen.append(this.jobTable);
  screen.append(this.progressBar);
  screen.append(this.stats);
  screen.render();

  // Getting out of the dashboard (might get useful...)
  screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
  });

  this.screen = screen;
}

module.exports = UI;