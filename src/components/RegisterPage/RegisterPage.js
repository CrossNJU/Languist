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

import RegisterCard from '../RegisterCard';

const title = 'Register';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

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
          <RegisterCard/>
        </div>
      </div>
    );
  }

}

export default withStyles(RegisterPage, s);
