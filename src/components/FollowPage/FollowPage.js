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
      },
      userList:[]
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
    try {
      // let user = await $.ajax('/api/current_user');
      let user = 'chenmuen';
      await this.setState({user:user});
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    console.log('render FollowPage');
    return (
      <div className="StarPage">
        <TitleBar text={this.state.user + '\'s Follow'} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Filter data={[this.state.following, this.state.followers]}
                      current={this.state.current}/>
            </div>
            <div className={s.main}>
              <UserList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(FollowPage, s);
