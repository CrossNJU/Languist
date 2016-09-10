/**
 * Created by PolarisChen on 16/9/9.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TitleBar.scss';

class TitleBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.text}>
            <h1>{this.props.text}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(TitleBar, s);
