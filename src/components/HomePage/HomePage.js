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

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

let repoData = [
  {
    avatarUrl: '',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces. https://facebook.github.io/react/',
    tags: [
      'JavaScript',
      'Framework'
    ]
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
    ]
  }
];

class RepoItem extends Component {
  render() {
    return (
      <div>
        <img className="avatar" src={require('./avatar-default.png')} width="36" height="36" alt="Avatar" />
        <h3>{this.props.repo.owner}/{this.props.repo.name}</h3>
        <p>{this.props.repo.description}</p>
        <div className="tags">
          {
            this.props.repo.tags.map((tag, i) => {
              return <div key={i}>{tag}</div>;
            })
          }
        </div>
        <div className="actions">
          <button>STAR</button>
          <button>VIEW</button>
        </div>
      </div>
    );
  }
}

class RepoList extends Component {
  renderRepos() {
    let repos = repoData.map(repo => {
      return (<RepoItem key={repo.owner + repo.name} repo={repo} />);
    });
    return repos;
  };

  render() {
    return (
      <div>
        {this.renderRepos()}
      </div>
    );
  }
}

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
