/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cover.scss';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

class Cover extends Component {
  render() {
    return (
      <Paper>
        <div className={s.root}>
          <div className={s.container}>
            <Avatar src={require('./avatar-default.png')} size={112} className={s.avatar}/>
            <div className={s.text}>
              <h1>Polaris Chen</h1>
              <p>8 Languages</p>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(Cover, s);
