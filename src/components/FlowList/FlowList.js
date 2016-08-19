/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FlowList.scss';

import RepoFlowItem from '../RepoFlowItem';
import UserFlowItem from '../UserFlowItem';
import LangFlowItem from '../LangFlowItem';
import LoadingFlowItem from '../LoadingFlowItem';


let flowData = [
  {
    type: 'repo',
    avatarUrl: '',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces. https://facebook.github.io/react/',
    tags: [
      'JavaScript',
      'Framework'
    ],
    update: 'July 11, 2016',
    star: 2731
  },
  {
    type: 'user',
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
  },
  {
    type: 'lang',
    name: 'JavaScript',
    description: 'A popular programming language for front-end development.'
  },
  {
    type: 'repo',
    avatarUrl: '',
    owner: 'callemall',
    name: 'material-ui',
    description: 'React Components that Implement Google\'s Material Design. http://www.material-ui.com',
    tags: [
      'JavaScript',
      'Framework',
      'React',
      'UI'
    ],
    update: 'July 11, 2016',
    star: 1523
  }
];

class FlowList extends Component {
  constructor(props) {
    super(props);
  }
  renderFlowItems() {
    console.log(JSON.parse(JSON.stringify(this.props.data)));
    flowData = this.props.data;
    if (flowData.length > 0) {
      let flowItems = flowData.map(flowItem => {
        switch(flowItem.type) {
          case 'repo':
            return <RepoFlowItem key={flowItem.owner + flowItem.name} repo={flowItem} />;
          case 'user':
            return <UserFlowItem kay={flowItem.login} user={flowItem} />;
          case 'lang':
            return <LangFlowItem key={flowItem.name} lang={flowItem} />;
          default:
            return;
        }
      });
      return flowItems;
    } else {
      return (<LoadingFlowItem />);
    }
  };

  render() {
    return (
      <div className={s.container}>
        {this.renderFlowItems()}
      </div>
    );
  }
}

export default withStyles(FlowList, s);
