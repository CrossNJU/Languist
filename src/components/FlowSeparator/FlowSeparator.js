/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FlowSeparator.scss';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

class FlowSeparator extends Component {
  render() {
    return (
      <Paper className={s.item}>
        <div className={s.title}>--- {this.props.text} ---</div>
      </Paper>
    );
  }
}

export default withStyles(FlowSeparator, s);
