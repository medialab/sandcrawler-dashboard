/**
 * Sandcrawler Dashboard Stats Component
 * ======================================
 *
 * Component displaying basic stats about the spider.
 */
import React, {Component, PropTypes} from 'react-blessed/node_modules/react';
import stylesheet from '../stylesheet';
import {formatHMS, formatMS} from '../helpers';
import _ from 'lodash';

export default class Stats extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      stats: [],
      info: []
    };
  }

  componentWillMount() {
    const spider = this.context.spider;

    // Rendering every 30ms
    const update = () => {
      const errors = _(spider.stats.errorIndex)
        .pairs()
        .sortBy(p => -p[1])
        .map(p => `  {red-fg}${p[0]}{/} ${p[1]}`)
        .value();

      const elapsed = spider.stats.getElapsedTime(),
            estimate = spider.stats.getRemainingTimeEstimation(),
            average = spider.stats.averageTimePerJob;

      this.setState({
        stats: [
          `{gray-fg}{bold}Queued jobs{/}      ${spider.stats.queued}`,
          `{gray-fg}{bold}In-progress jobs{/} ${spider.stats.doing}`,
          `{gray-fg}{bold}Done jobs{/}        ${spider.stats.done}`,
          '',
          `{gray-fg}{bold}Successes{/}        {green-fg}${spider.stats.successes}{/}`,
          `{gray-fg}{bold}Failures{/}         {red-fg}${spider.stats.failures}{/}`,
          `{gray-fg}{bold}Sucess Rate{/}      ${spider.stats.successRate}%`,
          '',
          `{gray-fg}{bold}Engine type{/}      ${spider.type}`,
          `{gray-fg}{bold}Concurrency{/}      ${spider.options.concurrency}`
        ],
        info: [
          `{gray-fg}{bold}Elapsed time{/}   ${formatHMS(elapsed)}`,
          `{gray-fg}{bold}Remaining time{/} ${formatHMS(estimate)}`,
          `{gray-fg}{bold}Time per job{/}   ${formatMS(average)}`,
          `{gray-fg}{bold}Errors{/}`
        ].concat(errors)
      });
    };

    setInterval(update, 30);
  }

  render() {
    return (
      <box top={this.props.top}>
        <list class={stylesheet.bordered}
              items={this.state.stats}
              label="Stats"
              width="50%"
              tags={true}
              interactive={false} />
        <list class={stylesheet.bordered}
              items={this.state.info}
              label="Stats"
              width="50%"
              left="50%"
              tags={true}
              interactive={false} />
      </box>
    );
  }
}
