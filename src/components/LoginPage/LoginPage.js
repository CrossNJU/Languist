/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './LoginPage.scss';
import $ from 'jquery';


import LoginCard from '../LoginCard';

const title = 'Log In';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameError: "",
      passwordError: ""
    }
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <LoginCard/>
        </div>
      </div>
    );
  }

}

export default withStyles(LoginPage, s);
