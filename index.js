/**
 * Sandcrawler Dashboard Plugin
 * =============================
 *
 * Displays a handy dashboard for the spider using it.
 */
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

module.exports = function(opts) {

  return function(spider) {

    // Building the UI
    var screen = blessed.screen(),
        grid = new contrib.grid({rows: 1, cols: 2}),
        leftGrid = new contrib.grid({rows: 2, cols: 1}),
        rightGrid = new contrib.grid({rows: 3, cols: 1});

    grid.set(0, 0, leftGrid);
    grid.set(0, 1, rightGrid);

    // Log component
    leftGrid.set(0, 0, contrib.log, {
      label: 'Log'
    });

    // TODO...
    leftGrid.set(1, 0, blessed.Element, {
      label: 'Sample Data'
    });

    rightGrid.set(0, 0, contrib.table, {
      label: 'Jobs'
    });

    rightGrid.set(1, 0, contrib.log, {
      label: 'Spider Progress'
    });

    rightGrid.set(2, 0, blessed.Element, {
      label: 'Stats'
    });

    // Rendering the UI
    grid.applyLayout(screen);
    screen.render();

    // Getting out of the dashboard (might get useful...)
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // Retrieving components
    var rollingLog = leftGrid.get(0, 0);
  };
};
