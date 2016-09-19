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
import StarDialog from '../StarDialog';

const title = 'Related Recommends';

// let repo = {
//   avatarUrl: '',
//   owner: 'kriasoft',
//   name: 'react-starter-kit',
//   description: 'React Starter Kit — isomorphic web app boilerplate (Node.js, Express, GraphQL, React.js, Babel 6, PostCSS, Webpack, Browsersync) https://www.reactstarterkit.com',
//   tags: [
//     'JavaScript',
//     'Framework',
//     'React',
//     'Starter Kit'
//   ],
//   update: 'July 11, 2016',
//   star: 9298,
//   set: 'UNGROUPED'
// };

let repo = {
  avatarUrl: '',
  owner: 'Unknown',
  name: 'Unknown',
  description: 'Unknown',
  tags: [

  ],
  update: 'Unknown',
  star: 0,
  set: 'Unknown'
};

class RelatedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repo: repo,
      // repoList: [],
      user: '',
      // Star dialog
      isStarDialogOpen: false,
      currentStar: '',
      setList: []
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
    let user = await $.ajax('/api/current_user');
    let repo = this.props.query.repo;

    if(!repo) {
      window.location.href = '/home';
    } else if(user) {
      // Get other data
      this.setState({user: user});
      this.getRepoInfo();
      this.getRelatedRepo();
      this.getSetList(user);
    } else {
      window.location.href = '/login';
    }
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
    $.ajax(url, {data: {fullName: this.props.query.repo, user: this.state.user}})
      .done(((repoList)=>{
        this.setState({repoList: repoList});
      }))
  }

  getSetList(user) {
    let url = '/api/repo/setList';
    $.ajax(url, {data: {user: user}})
      .done(((data) => {
        let setList = [];
        let all = {name: 'All', count: 0};
        setList.push(all);
        data.forEach((set) => {
          all.count += set.repoNum;
          setList.push({name: set.setName, count: set.repoNum});
        });

        this.setState({setList: setList});
      }).bind(this));
  }

  // Handle StarDialog
  handleOpenStarDialog(repo) {
    console.log(repo);
    this.setState({isStarDialogOpen: true, currentStar: repo});
  }

  handleCloseStarDialog(isSuccess, set) {
    let newState = {};
    newState.isStarDialogOpen = false;
    newState.currentStar = '';
    if (isSuccess) {
      this.getSetList(this.state.user);
      this.state.repoList.forEach((repo)=> {
        if(repo.full_name == this.state.currentStar) {
          repo.set = set;
        }
      });
      if(this.state.repo.full_name == this.state.currentStar) {
        this.state.repo.set = set;
      }
      newState.repoList = this.state.repoList;
      newState.repo = this.state.repo;
    }
    this.setState(newState);
  }

  async handleUnstar(repo) {
    let user = this.state.user;
    let data = {user, repo};
    let url = '/api/repo/unstar';
    let res = await $.ajax({url, data, type: 'POST'});
    if (res.res === 1) {
      this.setStarSet(repo);
      this.props.handleSnackbarOpen(`${repo} is removed from your stars :-)`);
      return true;
    }
    return false;
  }

  setStarSet(repo) {
    this.state.repoList.forEach((data)=> {
      if(data.full_name === repo) {
        data.set = '';
      }
    });
    if(this.state.repo.full_name == repo) {
      this.state.repo.set = '';
    }
    this.setState({repoList: this.state.repoList, repo: this.state.repo});
  }

  render() {
    console.log('render RelatedPage');
    return (
      <div className="RelatedPage">
        <TitleBar text={title} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <RepoFlowItem repo={this.state.repo} single={true} handleStar={this.handleOpenStarDialog.bind(this)} handleUnstar={this.handleUnstar.bind(this)}/>
            </div>
            <div className={s.main}>
              <RepoList
                data={this.state.repoList}
                handleStar={this.handleOpenStarDialog.bind(this)}
                handleUnstar={this.handleUnstar.bind(this)}
                loadingText="Loading related repositories"
                emptyText="No related repository"
              />
            </div>
          </div>
        </div>
        <StarDialog isOpen={this.state.isStarDialogOpen}
                    setList=
                      {this.state.setList.filter((set)=> {
                        return set.name != 'All'
                      })}
                    handleClose={this.handleCloseStarDialog.bind(this)}
                    repo = {this.state.currentStar}
                    user = {this.state.user}/>
      </div>
    );
  }
}

export default withStyles(RelatedPage, s);
