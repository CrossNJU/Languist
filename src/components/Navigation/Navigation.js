/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import Link from '../Link';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Search from 'material-ui/svg-icons/action/search';
import Account from 'material-ui/svg-icons/action/account-circle';

const styles = {
  button: {
    color: '#FFF'
  }
}

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    let isLogin = this.props.login;
    if (isLogin) {
      return (
        <div className={cx(s.root, this.props.className)} role="navigation">
          <IconButton iconStyle={styles.button}><Search /></IconButton>
          <IconMenu
            iconButtonElement={<IconButton iconStyle={styles.button}><Account /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Send feedback" />
            <MenuItem primaryText="About us" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        </div>
      );
    } else {
      return (
        <div className={cx(s.root, this.props.className)} role="navigation">
          <Link className={s.link} to="/login">LOG IN</Link>
          <Link className={s.link} to="/register">SIGN UP WITH GITHUB</Link>
        </div>
      );
    };
  }

}

export default withStyles(Navigation, s);
