/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Count.scss';

import Paper from 'material-ui/Paper';

class Count extends Component {
  constructor(props) {
    super(props);
    console.log('constructor');
  }
  render() {
    console.log('render Count');
    const data = this.props.data;
    return (
      <Paper className={s.container}>
        <div className={s.item}>
          <div className={s.number}>{data.followersCount}</div>
          <div className={s.label}>Followers</div>
        </div>
        <div className={s.item}>
          <div className={s.number}>{data.starredCount}</div>
          <div className={s.label}>Starred</div>
        </div>
        <div className={s.item}>
          <div className={s.number}>{data.followingCount}</div>
          <div className={s.label}>Following</div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(Count, s);
