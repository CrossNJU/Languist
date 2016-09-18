/**
 * Created by PolarisChen on 16/9/18.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TextFlowItem.scss';

import Paper from 'material-ui/Paper';

class TextFlowItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Paper className={s.item}>
        {this.props.text}
      </Paper>
    );
  }
}

export default withStyles(TextFlowItem, s);
