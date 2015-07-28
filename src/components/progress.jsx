/**
 * Sandcrawler Dashboard Progress Bar
 * ===================================
 *
 * Component displaying the spider's completion.
 */
import React, {Component, PropTypes} from 'react-blessed/node_modules/react';
import stylesheet from '../stylesheet';

export default class Progress extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      completion: 0
    };
  }

  componentWillMount() {
    const updateCompletion = () => {
      this.setState({completion: spider.stats.completion});
    };

    const spider = this.context.spider;
    spider.on('job:add', updateCompletion);
    spider.on('job:end', updateCompletion);
  }

  render() {
    const label = `Progress - ${this.state.completion}%`;

    return (
      <progressbar class={stylesheet.bordered}
                   label={label}
                   top={this.props.top}
                   height="10%"
                   filled={this.state.completion}
                   style={{bar: {bg: 'blue'}}} />
    );
  }
}
