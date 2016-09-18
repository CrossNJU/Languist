/**
 * Created by PolarisChen on 16/8/14.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadingFlowItem.scss';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

class LoadingFlowItem extends Component {
  render() {
    return (
      <Paper className={s.item}>
        <CircularProgress size={0.8} />
        <div className={s.text}>{this.props.title||"Loading ..."}</div>
      </Paper>
    );
  }
}

export default withStyles(LoadingFlowItem, s);
