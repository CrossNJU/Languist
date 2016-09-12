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

class RegisterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
    }
  }

  async componentDidMount() {
    let url = '/api/temp_user';
    let user =  await $.ajax(url);
    this.setState({login: user});
  }

  handleSubmit() {
    let username = this.refs.username.input.value;
    let password = this.refs.password.input.value;

    this.props.handleSubmit(username, password);
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
        <TextField hintText="Username" fullWidth={true} ref="username" disabled={true}  value={this.state.login}/>
        <TextField hintText="Password" type="password" fullWidth={true} ref="password" errorText={this.props.passwordError} onKeyPress={this.handleEnter.bind(this)}/>
        <TextField hintText="Confirm Password" type="password" fullWidth={true} ref="password_again"/>
        <RaisedButton label={"SIGN UP"}
                      primary={true}
                      style={buttonStyle}
                      labelStyle={buttonLableStyle}
                      onClick={this.handleSubmit.bind(this)}/>
      </Paper>
    );
  }

}

export default withStyles(RegisterCard, s);
