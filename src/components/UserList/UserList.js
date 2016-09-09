/**
 * Created by PolarisChen on 16/9/9.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserList.scss';

import UserFlowItem from '../UserFlowItem';
import LoadingFlowItem from '../LoadingFlowItem';

let userData = [
  {
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
    followers: 12,
    isFollowing: true
  },
  {
    avatarUrl: '',
    login: 'KennethReitz',
    name: 'Kenneth Reitz',
    bio: 'A developer',
    url: 'http://bus1996.me',
    langs: [
      'JavaScript',
      'CSS'
    ],
    join: 'July 11, 2016',
    location: 'Nanjing, China',
    followers: 12,
    isFollowing: false
  },
  {
    avatarUrl: '',
    login: 'tj',
    name: 'TJ Holowaychuk',
    bio: 'A developer',
    url: 'http://bus1996.me',
    langs: [
      'JavaScript',
      'CSS'
    ],
    join: 'July 11, 2016',
    location: 'Nanjing, China',
    followers: 12,
    isFollowing: true
  }
];

class UserList extends Component {
  constructor(props) {
    super(props);
  }
  renderUserItems() {
    // console.log(JSON.parse(JSON.stringify(this.props.data)));
    // userData = this.props.data;
    if (userData.length > 0) {
      let items = userData.map(flowItem => {
        return <UserFlowItem key={flowItem.login} user={flowItem} />;
      });
      return items;
    } else {
      return (<LoadingFlowItem />);
    }
  };

  render() {
    return (
      <div className={s.container}>
        {this.renderUserItems()}
      </div>
    );
  }
}

export default withStyles(UserList, s);
