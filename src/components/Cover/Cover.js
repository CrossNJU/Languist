/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cover.scss';

import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';

class Cover extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = this.props.data;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Avatar src={data.avatar_url || require('./avatar-default.png')} size={112} className={s.avatar}/>
          <div className={s.text}>
            <h1>{data.name}</h1>
            <p>{data.langs} Languages</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(Cover, s);
