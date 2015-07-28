/**
 * Sandcrawler Dashboard Log Component
 * ====================================
 *
 * Component displaying the log of the spider through `sandcrawler-logger`.
 */
import React, {Component, PropTypes} from 'react-blessed/node_modules/react';
import stylesheet from '../stylesheet';

export default class Log extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  render() {
    return (
      <box class={stylesheet.bordered}
           label="Log"
           height="70%">
        This is the log.
      </box>
    );
  }
}
