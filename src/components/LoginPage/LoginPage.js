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

import s from './LoginPage.scss';

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

class LoginPage extends Component {
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
          <Paper className={s.content}>
            <p className={s.title}>Hi, Languist :-)</p>
            <TextField hintText="Username" fullWidth={true}/>
            <TextField hintText="Password" type="password"  fullWidth={true}/>
            <RaisedButton label="LOGIN" primary={true} style={buttonStyle} labelStyle={buttonLableStyle}/>
            <Link className={s.link} to="/">
              Forget password?
            </Link>
            <Divider style={dividerStyle}/>
            <RaisedButton label="SIGN UP WITH GITHUB" style={buttonStyle} secondary={true}  labelStyle={buttonLableStyle}/>
          </Paper>
        </div>
      </div>
    );
  }

}

export default withStyles(LoginPage, s);
