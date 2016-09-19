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
import $ from 'jquery';

import Link from '../Link';

import s from './RegisterCard.scss';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';


const style = {
  buttonLableStyle: {
    fontWeight: 'normal'
  },
  buttonStyle: {
    marginTop: '15px'
  },
  userNameStyle: {
    color: 'color(black lightness(+25%))'
  }
};


class RegisterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      passwordError: '',
      confirmError: '',
    }
  }

  async componentDidMount() {
    let url = '/api/temp_user';
    let user = await $.ajax(url);
    this.setState({login: user});
  }

  handleSubmit() {
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;
    let passwordAgain = this.refs.passwordAgain.input.value;

    let newState = {confirmError: '', passwordError: ''};

    if (password != passwordAgain) {
      newState.confirmError = 'The password must be identical to the above one';
    }else if (password.replace(/(^\s+)|(\s+$)/g,"").length < 6) {
      newState.passwordError = 'The length of password must be greater than 6';
    }

    if (newState.confirmError.length != 0 || newState.passwordError.length != 0) {
      this.setState(newState);
      return;
    }

    let url = '/api/register';
    $.ajax(url, {type: 'post', data: {username: username, password: password}})
      .done((message) => {
        console.log(message);
        switch (message.res) {
          case 1:
            window.location.href = '/language';
            break;
          case 0:
            this.setState({userNameError: '', passwordError: 'Register failed'});
            break;
        }
      })
  }

  handleEnter(event) {
    if (event.key == 'Enter') {
      this.handleSubmit();
    }
  }

  handleChange() {
    let password = this.refs.password.input.value;
    let passwordAgain = this.refs.passwordAgain.input.value;

    if (password == passwordAgain) {
      this.setState({confirmError: ''});
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
          disabled={true}
          value={this.state.login}
          inputStyle={style.userNameStyle}/>
        <TextField
          hintText="Password" type="password"
          fullWidth={true} ref="password"
          errorText={this.state.passwordError}
          onKeyPress={this.handleEnter.bind(this)}/>
        <TextField
          hintText="Confirm Password"
          errorText={this.state.confirmError}
          type="password"
          fullWidth={true}
          ref="passwordAgain"
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.handleEnter.bind(this)}/>
        <RaisedButton
          label={"SIGN UP"}
          primary={true}
          style={style.buttonStyle}
          labelStyle={style.buttonLableStyle}
          onTouchTap={this.handleSubmit.bind(this)}/>
      </Paper>
    );
  }

}

export default withStyles(RegisterCard, s);
