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
import s from './FollowPage.scss';
import Cover from '../Cover';
import Count from '../Count';
import RepoSetFilter from '../RepoSetFilter';
import Filter from '../Filter';
import RepoList from '../RepoList';
import UserList from '../UserList';
import FlowList from '../FlowList';
import FlowSeparator from '../FlowSeparator';
import FlowAction from '../FlowAction';
import RepoFlowItem from '../RepoFlowItem';
import SearchBar from '../SearchBar';
import TitleBar from '../TitleBar';

const title = 'Follow';


class FollowPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      current: "Following",
      following: {
        name: 'Following',
        count: 0
      },
      followers: {
        name: 'Followers',
        count: 0
      }
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);

    if(this.props.query.type == 'followers'){
      this.setState({current: 'Followers'});
    }
  }

  async componentDidMount() {
    console.log('componentDidMount');

    let user = await $.ajax('/api/current_user');

    if(user) {
      // let user = 'RickChem';
      this.getCount(user);
      this.getFollowList(user, this.state.current);
      this.setState({user:user});
    } else {
      window.location.href = '/login';
    }

  }

  getCount(user) {
    let url = '/api/user/folInfo';
    $.ajax(url, {data: {user: user}})
      .done(((data)=> {
        this.state.followers.count=data.followers;
        this.state.following.count=data.followings;
        console.log(data.followers);
        this.setState({followers: this.state.followers, following: this.state.following});
      }))
  }

  getFollowList(user, type) {
    let url;
    switch (type) {
      case 'Following':
         url = '/api/user/following';
        break;
      case 'Followers':
        url = '/api/user/follower';
        break;
    }

    $.ajax(url, {data: {user: user}})
      .done(((userList)=> {
        this.setState({userList: userList});
      }));
  }

  handleClickFilter(type) {
    this.getFollowList(this.state.user,type);
    this.setState({current: type});
  }

  render() {
    console.log('render FollowPage');
    return (
      <div className="StarPage">
        <TitleBar text={(this.state.user || 'Languist') + '\'s ' + this.state.current} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Filter
                data={[this.state.following, this.state.followers]}
                current={this.state.current}
                handleClick={this.handleClickFilter.bind(this)}
              />
            </div>
            <div className={s.main}>
              <UserList
                data={this.state.userList}
                loadingText={this.state.current === 'Following' ? 'Loading users you are following...' : 'Loading users following you...'}
                emptyText={this.state.current === 'Following' ? 'You are following no one' : 'No one is following you'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(FollowPage, s);
