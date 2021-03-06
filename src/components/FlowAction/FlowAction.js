/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FlowAction.scss';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

class FlowAction extends Component {
  constructor(props) {
    super(props);
  }
  handleLoad() {
    console.log('LOADING');
    this.props.handleLoad();
  }
  render() {
    return (
      <Paper className={s.item}>
        <FlatButton
          className={s.action}
          primary={true}
          label={this.props.hasMore ? 'Load Older Recommendations' : 'We would recommend you new repos and users at 5:00 every day.'}
          onTouchTap={this.handleLoad.bind(this)}
          disabled={!this.props.hasMore}
        />
      </Paper>
    );
  }
}

export default withStyles(FlowAction, s);
