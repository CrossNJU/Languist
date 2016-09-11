/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

import Paper from 'material-ui/Paper';

class Header extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} login={this.props.login} />
          <Link className={s.brand} to="/home">
            <img src={require('./logo-brand-text@2x.png')} height="32" alt="Languist" />
          </Link>
        </div>
      </div>
    );
  }

}

export default withStyles(Header, s);
