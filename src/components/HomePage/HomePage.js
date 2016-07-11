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
import s from './HomePage.scss';
import Cover from '../Cover';
import Count from '../Count';
import LanguageList from '../LanguageList';
import RepoList from '../RepoList';

const title = 'Home';

class HomePage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    return (
      <div className="HomePage">
        <Cover />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Count />
              <LanguageList />
            </div>
            <div className={s.main}>
              <RepoList />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(HomePage, s);
