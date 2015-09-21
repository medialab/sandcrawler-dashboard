/**
 * Sandcrawler Dashboard Log Component
 * ====================================
 *
 * Component displaying the log of the spider through `sandcrawler-logger`.
 */
import React, {Component, PropTypes} from 'react';
import logger from 'sandcrawler-logger';
import stylesheet from '../stylesheet';
import {extend} from 'lodash';

export default class Log extends Component {
  static contextTypes = {
    options: PropTypes.object.isRequired,
    spider: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      log: []
    };
  }

  componentDidMount() {
    this.context.spider.use(logger(extend({
      out: txt => {
        const newLog = this.state.log
          .concat(txt);

        while (newLog.length > this.refs.log.height - 2)
          newLog.shift();

        this.setState({log: newLog});
      }
    }, this.context.options.logger)))
  }

  componentDidUpdate() {
    this.refs.log.setScrollPerc(100);
  }

  render() {
    return (
      <box ref="log"
            class={stylesheet.bordered}
            interactive={false}
            scrollable={true}
            label="Log"
            height="70%"
            content={this.state.log.join('\n')} />
    );
  }
}
