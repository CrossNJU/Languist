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
import RaisedButton from 'material-ui/RaisedButton';

class Header extends Component {

  render() {
    return (
      <Paper className={s.root} style={{backgroundColor: "#F2DF83"}}>
        <div className={s.container}>
          <Navigation className={s.nav} />
          <Link className={s.brand} to="/">
            <img src={require('./logo-brand@2x.png')} width="150" height="36" alt="Languist" />
          </Link>
        </div>
      </Paper>
    );
  }

}

export default withStyles(Header, s);
