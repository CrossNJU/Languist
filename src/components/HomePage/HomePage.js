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
import s from './HomePage.scss';
import Cover from '../Cover';
import Count from '../Count';
import LanguageList from '../LanguageList';
import RepoList from '../RepoList';
import UserFlowItem from '../UserFlowItem';

const title = 'Home';

class HomePage extends Component {
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
        name: 'Languist',
        langs: 0
      },
      repoList: [],
      langList: []
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    console.log('componentDidMount');

    // try {
    //   // Get username
    //   const user = await $.ajax('/api/current_user');
    //   // Get other data
    //   await this.loadData(user);
    // } catch(err) {
    //   console.error(err);
    // }

    const user = 'ChenDanni';
    this.loadData(user);
  }

  loadData(user) {
    let url = '/api/home/';
    // Get count
    url = '/api/home/count?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({count: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    // Get cover
    url = '/api/home/cover?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({cover: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    // Get repoList
    url = '/api/home/repoList?user=' + user + '&lang=' + 'JavaScript';
    $.ajax(url)
    .done(((data) => {
      this.setState({repoList: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    // Get langList
    url = '/api/home/langList?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({langList: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  render() {
    let userData = {
      avatarUrl: '',
      login: 'PolarisChen',
      name: 'Polaris Chen',
      bio: 'A developer',
      url: 'http://bus1996.me',
      langs: [
        'JavaScript',
        'CSS'
      ],
      join: 'July 11, 2016',
      location: 'Nanjing, China',
      followers: 12
    }
    console.log('render HomePage');
    return (
      <div className="HomePage">
        <Cover data={this.state.cover} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Count data={this.state.count} />
              <LanguageList data={this.state.langList} />
            </div>
            <div className={s.main}>
              <RepoList data={this.state.repoList} />
              <UserFlowItem user={userData}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(HomePage, s);
