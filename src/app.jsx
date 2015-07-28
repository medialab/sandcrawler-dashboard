/**
 * Sandcrawler Dashboard React Blessed App
 * ========================================
 *
 * The rendered dashboard itself.
 */
import React, {Component, PropTypes} from 'react';
import {render} from 'react-blessed';
import Log from './components/log.jsx';
import ReqRes from './components/reqres.jsx';
import Jobs from './components/jobs.jsx';
import Progress from './components/progress.jsx';
import Stats from './components/stats.jsx';

class Application extends Component {
  static childContextTypes = {
    spider: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      spider: this.props.spider
    };
  }

  render() {
    return (
      <element>
        <LeftPanel />
        <RightPanel />
      </element>
    );
  }
}

class LeftPanel extends Component {
  render() {
    return (
      <element width="60%">
        <Log />
        <ReqRes top="70%" />
      </element>
    );
  }
}

class RightPanel extends Component {
  render() {
    return (
      <element left="60%" width="40%">
        <Jobs />
        <Progress top="60%" />
        <Stats top="70%" />
      </element>
    );
  }
}

export default function app(spider, opts) {

  const screen = render(<Application spider={spider} />, {
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: spider.name
  });

  // Will quit on ctrl + C
  screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
  });
};
