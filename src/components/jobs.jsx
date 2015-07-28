/**
 * Sandcrawler Dashboard Jobs Component
 * =====================================
 *
 * Component displaying the list of the current jobs.
 */
import React, {Component, PropTypes} from 'react';
import stylesheet from '../stylesheet';

export default class Jobs extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  render() {
    return (
      <box class={stylesheet.bordered}
           label='Jobs'
           height="60%">
        Job listing
      </box>
    );
  }
}
