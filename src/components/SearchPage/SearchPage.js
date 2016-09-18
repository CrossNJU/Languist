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
import s from './SearchPage.scss';
import Filter from '../Filter';
import RepoList from '../RepoList';
import SearchBar from '../SearchBar';
import StarDialog from '../StarDialog';
import LoadMoreButton from '../LoadMoreButton';

const title = 'Search';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasResult: false,
      hasMore: 0,
      user: '',

      repoList: undefined,
      langList: [],
      keyword: '',
      page: 1,
      language: 'All',

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

  async componentDidMount() {
    console.log('componentDidMount');
    let user = await $.ajax('/api/current_user');
    this.getSetList(user);
    this.setState({user: user});
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  async handleSearch(keyword) {
    let url = '/api/search/repo';
    let page = 1;
    let language = 'All';

    this.setState({hasResult:true, hasMore: 0, repoList:undefined, langList:[]});

    let data = await $.ajax(url, {data: {keyword: keyword, language: language, page: page}});
    console.log(data);

    if(data.repoList.length == 0) {
      this.setState({langList: [], repoList: [], page: 1, hasResult: false, hasMore: false, keyword: keyword, language: 'All'});

    } else {
      let langList = [];
      langList.push({name: 'All', count: data.count});
      data.language.forEach((lang)=> {
        langList.push(lang);
      });

      this.setState({langList: langList, repoList: data.repoList, page: 1, hasResult: true, keyword: keyword, language: 'All', hasMore: (data.repoList.length == 50?1:-1)});
    }

  };

  async handleFilter(language) {
    let url = '/api/search/repo';


    this.setState({hasResult: true, language: language, repoList: undefined, hasMore: 0});
    let data = await $.ajax(url, {data: {keyword: this.state.keyword, language: language, page: 1}});

    console.log(data);

    if(data.repoList.length == 0) {
      this.setState({repoList: [], hasResult: false, page: 1, hasMore: false});
    } else {
      this.setState({repoList: data.repoList, page: 1, hasResult: true, hasMore: (data.repoList.length == 50?1:-1)});
    }

  };

  async handleLoad() {
    let url = '/api/search/repo';

    this.setState({hasResult: true, hasMore: 0});
    let data = await $.ajax(url, {data: {keyword: this.state.keyword, language: this.state.language, page: this.state.page+1}});

    if(data.repoList.length == 0) {
      this.setState({hasMore: (data.repoList.length == 50)});
    } else {
      let repoList = this.state.repoList;
      data.repoList.forEach((repo)=> {
        repoList.push(repo);
      });
      this.setState({repoList: repoList, page: this.state.page+1, hasMore: (data.repoList.length == 50?1:-1)});
    }
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
      this.state.repoList.forEach((repo) => {
        if(repo.type == 'repo' && repo.full_name == this.state.currentStar) {
          repo.set = set;
        }
      });
      newState.flowList = this.state.flowList;
      this.props.handleSnackbarOpen(`${this.state.currentStar} is added to your star set <${set}> :-D`);
    }
    this.setState(newState);
  }

  async handleUnstar(repo) {
    let user = this.state.user;
    let url = `/api/repo/unstar?user=${user}&repo=${repo}`;
    let data = await $.ajax(url);
    if (data.res === 1) {
      this.setStarSet(repo);
      this.props.handleSnackbarOpen(`${repo} is removed from your stars :-)`);
      return true;
    }
    return false;
  }

  renderContainer() {

    if(this.state.hasResult) {
      return (
        <div className={s.container}>
          <div className={s.sidebar}>
            <Filter data={this.state.langList} current={this.state.language} handleClick={this.handleFilter.bind(this)}/>
          </div>
          <div className={s.main}>
            <RepoList
              user={this.state.user}
              data={this.state.repoList}
              handleUnstar={this.handleUnstar.bind(this)}
              handleStar={this.handleOpenStarDialog.bind(this)}
              loadingText="Loading repos you search for..."
              emptyText="Nothing found..."
            />
            <LoadMoreButton hasMore={this.state.hasMore} handleLoad={this.handleLoad.bind(this)}/>
          </div>
        </div>
      )
    } else {
      return null;
    }

  }

  render() {
    console.log('render SearchPage');
    return (
      <div className="SearchPage">
        <SearchBar handleSearch={this.handleSearch.bind(this)}/>
        <div className={s.root}>
          {this.renderContainer()};
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

export default withStyles(SearchPage, s);
