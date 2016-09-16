/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadMoreButton.scss';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  circularProgress: {
    position: 'relative',
    top: '-6px'
  }
};


class LoadMoreButton extends Component {
  constructor(props) {
    super(props);
  }

  handleLoad() {
    console.log('LOADING');
    this.props.handleLoad();
  }

  renderLabel() {
    switch (this.props.hasMore) {
      case 1:
        return 'Load More Result';
      case -1:
        return 'No More Result';
    }
  }

  render() {
    return (
      <Paper className={s.item}>
        <FlatButton
          className={s.action}
          primary={true}
          label={this.renderLabel()}
          icon={this.props.hasMore == 0 ? <CircularProgress size={0.5} innerStyle={style.circularProgress}/>:null}
          onTouchTap={this.handleLoad.bind(this)}
          disabled={this.props.hasMore!=1}
        />
      </Paper>
    );
  }
}

export default withStyles(LoadMoreButton, s);
