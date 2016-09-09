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

  handleRegister(username, password) {
    let url = '/api/register';

    $.ajax(url, {data:{username: username, password: password}})
      .done((message) => {
        console.log(message);
        switch (message.res) {
          case 1:
            window.location.href='/home';
            break;
          case 0:
            this.setState({userNameError: 'Register failed', passwordError: ''});
            break;
        }
      })
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <LoginCard handleSubmit={this.handleRegister.bind(this)} type="register" userNameError={this.state.userNameError} passwordError={this.state.passwordError}/>
        </div>
      </div>
    );
  }

}

export default withStyles(RegisterPage, s);
