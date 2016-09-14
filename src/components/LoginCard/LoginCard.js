/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery'

import Link from '../Link';

import s from './LoginCard.scss';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const title = 'Log In';

const url = "https://github.com/login/oauth/authorize?scope=user%20public_repo&client_id=d310933db63d64f563a0";

const dividerStyle = {
  marginTop: '10px',
  marginBottom: '10px',
  height: '2px'
};
const buttonLableStyle = {
  fontWeight: 'normal'
};
const buttonStyle = {
  marginTop: '15px'
};

class LoginCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameError: '',
      passwordError: ''
    }
  }

  handleSubmit() {
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;

    let url = '/api/login';

    $.ajax(url, {data:{username: username, password: password}})
      .done((message) => {
        console.log(message);
        switch (message.res) {
          case 1:
            window.location.href='/home';
            break;
          case 0:
            this.setState({userNameError: "", passwordError: 'The password is incorrect'});
            break;
          case -1:
            this.setState({userNameError: 'The username is not found', passwordError:""});
            break;
          case -2:
            this.setState({userNameError: 'The password is not set', passwordError:""});
            break;
        }
      })
  }

  handleEnter(event) {
    if(event.key == 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <Paper className={s.content}>
        <p className={s.title}>Hi, Languist :-)</p>
        <TextField
          hintText="Username"
          fullWidth={true}
          ref="username"
          errorText={this.state.userNameError}
          onKeyPress={this.handleEnter.bind(this)}/>
        <TextField
          hintText="Password"
          type="password"
          fullWidth={true}
          ref="password"
          errorText={this.state.passwordError}
          onKeyPress={this.handleEnter.bind(this)}/>
        <RaisedButton
          label={"LOGIN"}
          primary={true}
          style={buttonStyle}
          labelStyle={buttonLableStyle}
          onTouchTap={this.handleSubmit.bind(this)}/>
        <Link className={s.link} to="/">
          Forget password?
        </Link>
        <Divider style={dividerStyle}/>
        <RaisedButton
          label="SIGN UP WITH GITHUB"
          href={url}
          style={buttonStyle} secondary={true}
          labelStyle={buttonLableStyle}/>
      </Paper>
    );
  }

}

export default withStyles(LoginCard, s);
