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

import s from './RegisterPage.scss';
import $ from 'jquery';

import LoginCard from '../LoginCard';

const title = 'Register';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  handleLogin(username, password) {
    let url = '/api/login';

    $.ajax(url, {data:{username: username, password: password}})
      .done((message) => {
        console.log(message);
        if(message == "success") {
          window.location.href = "/home";
        } else {
          console.log('fail');
        }
      })
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <LoginCard handleSubmit={this.handleLogin.bind(this)} type="register"/>
        </div>
      </div>
    );
  }

}

export default withStyles(RegisterPage, s);
