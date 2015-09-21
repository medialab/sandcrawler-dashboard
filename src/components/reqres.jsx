/**
 * Sandcrawler Dashboard Request/Response Component
 * =================================================
 *
 * Component displaying the current request and its response.
 */
import React, {Component, PropTypes} from 'react';
import chalk from 'chalk';
import stylesheet from '../stylesheet';
import {formatUrl} from '../helpers';
import {inspect} from 'util';
import _ from 'lodash';

function update(err, job, width) {
  if (!job) {
    job = err;
    err = null;
  }

  // Request
  let reqText = '';
  reqText += chalk.grey.bold('Url') + ' ' + formatUrl(job.req.url, width - 2 - 4) + '\n';

  _(job.req)
    .omit(['url', 'retry', 'retryNow', 'retryLater'])
    .forIn(function(v, k) {
      reqText += chalk.grey.bold(_.capitalize(k)) + ' ' + inspect(v, {depth: 1}) + '\n';
    })
    .value();

  // Response
  let resText = '';

  resText += chalk.grey.bold('Url') + ' ' + formatUrl(job.res.url || job.req.url, width - 2 - 4) + '\n';

  if (err)
    resText += chalk.red.bold('Error') + ' ' + (err.message || err) + '\n';

  resText += chalk[err ? 'grey' : 'green'].bold('Data') + ' ' + inspect(job.res.data, {depth: 1}) + '\n';

  _(job.res)
    .omit(['url', 'body', 'data', 'error'])
    .forIn(function(v, k) {
      resText += chalk.grey.bold(_.capitalize(k)) + ' ' + inspect(v, {depth: 1}) + '\n';
    })
    .value();

  return {
    request: reqText,
    response: resText
  };
}

export default class ReqRes extends Component {
  static contextTypes = {
    spider: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      request: null,
      response: null
    };
  }

  componentDidMount() {
    const setState = (err, job) => this.setState(update(err, job, this.refs.box.width));

    this.context.spider.on('job:success', setState);
    this.context.spider.on('job:fail', setState);
  }

  render() {
    return (
      <box top={this.props.top}>
        <box ref="box"
             class={stylesheet.bordered}
             label="Request"
             width="50%">
          {this.state.request}
        </box>
        <box class={stylesheet.bordered}
             label="Response"
             left="50%"
             width="50%">
          {this.state.response}
        </box>
      </box>
    );
  }
}
