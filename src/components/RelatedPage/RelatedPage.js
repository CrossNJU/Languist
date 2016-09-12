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
import s from './RelatedPage.scss';
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

const title = 'Related Recommends';


let repo = {
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
  star: 9298,
  set: 'UNGROUPED'
};

class RelatedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repo: repo,
      // repo: {},
      repoList: [],
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  async componentDidMount() {
    console.log('componentDidMount');
    this.getRepoInfo();
    this.getRelatedRepo();
  }

  getRepoInfo() {
    let repoName = this.props.query.repo;

    $.ajax('/api/repo/info', {data: {fullName: repoName}})
      .done(((repo)=> {
        this.setState({repo: repo});
      }).bind(this))
  }

  getRelatedRepo() {
    console.log('get related repo');
    let url = 'api/repo/related';
    $.ajax(url, {data: {fullName: this.props.query.repo}})
      .done(((repoList)=>{
        this.setState({repoList: repoList});
      }))
  }

  render() {
    console.log('render RelatedPage');
    return (
      <div className="RelatedPage">
        <TitleBar text={title} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <RepoFlowItem repo={this.state.repo} />
            </div>
            <div className={s.main}>
              <RepoList data={this.state.repoList}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(RelatedPage, s);
