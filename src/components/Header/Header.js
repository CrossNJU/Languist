/**
 * Created by PolarisChen on 16/9/11.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

import Paper from 'material-ui/Paper';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link className={s.brand} to="/home">
            <img src={require('./logo-brand-text@2x.png')} height="32" alt="Languist" />
          </Link>
          <Navigation className={s.nav} login={this.props.login} handleLogout={this.props.handleLogout} />
        </div>
      </div>
    );
  }

}

export default withStyles(Header, s);
