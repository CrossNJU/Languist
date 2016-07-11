/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoList.scss';

import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';

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

export default withStyles(RepoList, s);
