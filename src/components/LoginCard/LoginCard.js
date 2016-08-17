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

import Link from '../Link';

import s from './LoginCard.scss';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const title = 'Log In';

const dividerStyle = {
  marginTop: '10px',
  marginBottom: '10px',
  height: '2px'
};
const buttonLableStyle = {
  fontWeight: 'normal'
};
const buttonStyle = {
  marginTop: '10px'
};

class LoginCard extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit() {
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;

    this.props.handleSubmit(username, password);
  }

  renderBtn() {
    if(this.props.type == 'login') {
      return (
        <div className={s.inputGroup}>
          <RaisedButton label={"LOGIN"}
                        primary={true}
                        style={buttonStyle}
                        labelStyle={buttonLableStyle}
                        onClick={this.handleSubmit.bind(this)}/>
          <Link className={s.link} to="/">
            Forget password?
          </Link>
          <Divider style={dividerStyle}/>
          <RaisedButton label="SIGN UP WITH GITHUB"
                        href="https://github.com/login/oauth/authorize?client_id=d310933db63d64f563a0"
                        style={buttonStyle} secondary={true}
                        labelStyle={buttonLableStyle}/>
        </div>
      )
    } else {
      return (
        <div className={s.inputGroup}>
          <TextField hintText="Confirm Password" type="password"  fullWidth={true} ref="password_again"/>
          <RaisedButton label={"LOGIN"}
                        primary={true}
                        style={buttonStyle}
                        labelStyle={buttonLableStyle}
                        onClick={this.handleSubmit.bind(this)}/>
        </div>
      );
    }
  }

  render() {
    return (
      <Paper className={s.content}>
        <p className={s.title}>Hi, Languist :-)</p>
        <TextField hintText="Username" fullWidth={true} ref="username"/>
        <TextField hintText="Password" type="password"  fullWidth={true} ref="password"/>
        {this.renderBtn()}
      </Paper>
    );
  }

}

export default withStyles(LoginCard, s);
