/**
 * Sandcrawler Dashboard Request/Response Component
 * =================================================
 *
 * Component displaying the current request and its response.
 */
import React, {Component, PropTypes} from 'react-blessed/node_modules/react';
import stylesheet from '../stylesheet';

export default class ReqRes extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  render() {
    return (
      <box top={this.props.top}>
        <box class={stylesheet.bordered}
             label="Request"
             width="50%">
          Information here...
        </box>
        <box class={stylesheet.bordered}
             label="Response"
             left="50%"
             width="50%">
          Information here...
        </box>
      </box>
    );
  }
}
