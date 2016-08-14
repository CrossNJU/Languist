/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoList.scss';

import LoadingFlowItem from '../LoadingFlowItem';
import RepoFlowItem from '../RepoFlowItem';


let repoData = [
  {
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
  },
  {
    avatarUrl: '',
    owner: 'kriasoft',
    name: 'react-starter-kit',
    description: 'React Starter Kit — isomorphic web app boilerplate (Node.js, Express, GraphQL, React.js, Babel 6, PostCSS, Webpack, Browsersync) https://www.reactstarterkit.com',
    tags: [
      'JavaScript',
      'Framework',
      'React',
      'Starter Kit'
    ],
    update: 'July 11, 2016',
    star: 9298
  }
];

class RepoList extends Component {
  constructor(props) {
    super(props);
  }
  renderRepos() {
    console.log(JSON.parse(JSON.stringify(this.props.data)));
    repoData = this.props.data;
    if (repoData.length > 0) {
      let repos = repoData.map(repo => {
        return (<RepoFlowItem key={repo.owner + repo.name} repo={repo} />);
      });
      return repos;
    } else {
      return (<LoadingFlowItem />);
    }
  };

  render() {
    return (
      <div className={s.container}>
        {this.renderRepos()}
      </div>
    );
  }
}

export default withStyles(RepoList, s);
