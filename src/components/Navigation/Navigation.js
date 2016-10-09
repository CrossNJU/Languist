/**
 * Created by PolarisChen on 16/9/11.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import {github_signup_url} from '../../config';
import Link from '../Link';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Search from 'material-ui/svg-icons/action/search';
import Account from 'material-ui/svg-icons/action/account-circle';
import Star from 'material-ui/svg-icons/toggle/star';
import Person from 'material-ui/svg-icons/social/person';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import Feedback from 'material-ui/svg-icons/action/feedback';

const styles = {
  button: {
    color: '#FFF'
  }
}

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  handleLogout() {
    this.props.handleLogout();
  }

  handleSnackbarOpen() {
    this.props.handleSnackbarOpen('Open from Header');
  }

  render() {
    let isLogin = this.props.login;
    if (isLogin) {
      return (
        <div className={cx(s.root, this.props.className)} role="navigation">
          <IconButton iconStyle={styles.button} href="/search"><Search /></IconButton>
          <IconButton iconStyle={styles.button} onTouchTap={this.props.handleFeedback}><Feedback /></IconButton>
          <IconMenu
            iconButtonElement={<IconButton iconStyle={styles.button}><Account /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Starred" leftIcon={<Star />} href="/starred" />
            <MenuItem primaryText="Following" leftIcon={<Person />} href="/follow?type=following" />
            <Divider />
            <MenuItem primaryText="Sign out" leftIcon={<Exit />} onTouchTap={this.handleLogout.bind(this)} />
          </IconMenu>
        </div>
      );
    } else {
      return (
        <div className={cx(s.root, this.props.className)} role="navigation">
          <Link className={s.link} to="/login">LOG IN</Link>
          <a className={s.link} href={github_signup_url}>SIGN UP WITH GITHUB</a>
        </div>
      );
    };
  }

}

export default withStyles(Navigation, s);
