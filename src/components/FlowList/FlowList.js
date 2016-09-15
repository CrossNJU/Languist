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
import FlowSeparator from '../FlowSeparator';
import FlowAction from '../FlowAction';

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

class FlowUnit extends Component {
  constructor(props) {
    super(props);
  }
  renderFlowItems() {
    flowData = this.props.data;
    if (flowData.length > 0) {
      let flowItems = flowData.map(flowItem => {
        switch(flowItem.type) {
          case 'repo':
            return (
              <RepoFlowItem
                key={flowItem.owner + flowItem.name}
                currentUser={this.props.user}
                repo={flowItem}
                optional={true}
                handleUnlike={this.props.handleUnlike}
                handleStar={this.props.handleStar}
                handleUnstar={this.props.handleUnstar}
              />
            );
          case 'user':
            return (
              <UserFlowItem
                key={flowItem.login}
                currentUser={this.props.user}
                user={flowItem}
                optional={true}
                handleUnlike={this.props.handleUnlike}
                handleFollow={this.props.handleFollow}
                handleUnfollow={this.props.handleUnfollow}
              />
            );
          case 'lang':
            return (
              <LangFlowItem
                key={flowItem.name}
                lang={flowItem}
                handleAdd={this.props.handleAddLanguage}
              />
            );
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
      <div>
        <FlowSeparator text={this.props.title} />
        {this.renderFlowItems()}
      </div>
    )
  }
}

class FlowUnitList extends Component {
  constructor(props) {
    super(props)
  }
  renderFlowUnits() {
    if (this.props.list.length > 0) {
      let fus = this.props.list.map(unit => {
        return (
          <FlowUnit
            key={unit.title}
            data={unit.data}
            title={unit.title}
            user={this.props.user}
            handleStar={this.props.handleStar}
            handleFollow={this.props.handleFollow}
            handleUnlike={this.props.handleUnlike}
            handleAddLanguage={this.props.handleAddLanguage}
            handleUnfollow={this.props.handleUnfollow}
            handleUnstar={this.props.handleUnstar}
          />
        )
      });
      return fus;
    } else {
      return (<LoadingFlowItem />);
    }
  }
  render() {
    return (
      <div>
        {this.renderFlowUnits()}
      </div>
    )
  }
}

class FlowList extends Component {
  constructor(props) {
    super(props);
  }
  renderLoadAction() {
    return <FlowAction handleLoad={this.props.handleLoad} hasMore={this.props.hasMore} />
  }
  render() {
    return (
      <div className={s.container}>
        <FlowUnitList
          list={this.props.data}
          user={this.props.user}
          handleStar={this.props.handleStar}
          handleFollow={this.props.handleFollow}
          handleUnlike={this.props.handleUnlike}
          handleAddLanguage={this.props.handleAddLanguage}
          handleUnfollow={this.props.handleUnfollow}
          handleUnstar={this.props.handleUnstar}
        />
        {this.renderLoadAction()}
      </div>
    );
  }
}

export default withStyles(FlowList, s);
