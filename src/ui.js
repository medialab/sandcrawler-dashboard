/**
 * Sandcrawler Dashboard UI
 * =========================
 *
 * Defining the blessed UI used by the plugin.
 */
var blessed = require('blessed');

function UI() {

  var screen = blessed.screen();

  // Log component
  this.log = blessed.list({
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
  this.log.lines = [];

  // Data sample component
  this.dataSample = blessed.box({
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
  this.jobTable = blessed.box({
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
  this.progressBar = blessed.ProgressBar({
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
  this.stats = blessed.box({
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
