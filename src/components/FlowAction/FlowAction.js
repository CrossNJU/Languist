/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FlowAction.scss';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

class FlowAction extends Component {
  render() {
    return (
      <Paper className={s.item}>
        <FlatButton className={s.action} primary={true} label='Load Older Recommendations' />
      </Paper>
    );
  }
}

export default withStyles(FlowAction, s);
