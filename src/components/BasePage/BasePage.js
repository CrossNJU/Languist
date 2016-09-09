/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BasePage.scss';
import Cover from '../Cover';
import Count from '../Count';
import RepoSetFilter from '../RepoSetFilter';
import Filter from '../Filter';
import RepoList from '../RepoList';
import UserList from '../UserList';
import FlowList from '../FlowList';
import FlowSeparator from '../FlowSeparator';

const title = 'Home';

let currentRepoSetFilter = 'Ungrouped';
let repoSetFilterData = [
  {
    name: 'All',
    count: 34
  },
  {
    name: 'Ungrouped',
    count: 18
  },
  {
    name: 'React',
    count: 3
  },
  {
    name: 'UI',
    count: 4
  },
  {
    name: 'CSS Framework',
    count: 4
  },
  {
    name: 'iOS',
    count: 3
  }
];

let currentUserFilter = 'Following';
let userFilterData = [
  {
    name: 'Following',
    count: 34
  },
  {
    name: 'Followers',
    count: 18
  }
];

let currentLanguageFilter = 'JavaScript';
let languageFilterData = [
  {
    name: 'All',
    count: 34
  },
  {
    name: 'JavaScript',
    count: 18
  },
  {
    name: 'CSS',
    count: 3
  },
  {
    name: 'HTML',
    count: 4
  },
  {
    name: 'Java',
    count: 4
  },
  {
    name: 'Python',
    count: 3
  }
];

class BasePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: {
        followingCount: 0,
        followersCount: 0,
        starredCount: 0
      },
      cover: {
        avatar_rul: '',
        name: 'PolarisChen\'s Starred',
        langs: 0
      },
      repoList: [],
      flowList: [],
      langList: []
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  render() {
    console.log('render BasePage');
    return (
      <div className="BasePage">
        <Cover data={this.state.cover}/>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Count data={this.state.count}/>
              <RepoSetFilter data={repoSetFilterData} current={currentRepoSetFilter} />
              <Filter data={userFilterData} current={currentUserFilter} />
              <Filter data={languageFilterData} current={currentLanguageFilter} />
            </div>
            <div className={s.main}>
              <RepoList />
              <FlowSeparator text='Sep. 9th' />
              <UserList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(BasePage, s);
