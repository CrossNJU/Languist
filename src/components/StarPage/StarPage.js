/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StarPage.scss';
import RepoSetFilter from '../RepoSetFilter';
import RepoList from '../RepoList';
import TitleBar from '../TitleBar';
import AddSetDialog from '../AddSetDialog';
import StarDialog from '../StarDialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const title = 'Starred';

class StarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      setList: [],

      owner: "",
      ownerSetList: [],

      repoList: [],

      isLanguist: true,
      currentSet: 'All',

      // Add set dialog
      isSetDialogOpen: false,

      // Star dialog
      isStarDialogOpen: false,
      currentStar: '',
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

    // get user
    let user = await $.ajax('/api/current_user');
    let owner = this.props.query.owner || user;
    let isLanguist = true;

    if(user == owner) {
      this.getSetList(user, owner);
    } else {
      isLanguist = ((await $.ajax('/api/user/isLanguist', {data: {login: owner}})).res == 1);
      this.getSetList(user, owner);
      this.getOwnerSetList(owner, isLanguist);
    }
    this.getRepoList(user, 'All', isLanguist);

    this.setState({user: user, owner: owner, isLanguist: isLanguist});

  }

  async getSetList(user, owner) {
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

        if(user == owner) {
          this.setState({setList: setList, ownerSetList: setList});
        }else {
          this.setState({setList: setList});
        }
      }).bind(this));
  }

  async getOwnerSetList(owner, isLanguist) {
    if(isLanguist) {
      let url = '/api/repo/setList';
      $.ajax(url, {data: {user: owner}})
        .done(((data) => {
          let setList = [];
          let all = {name: 'All', count: 0};
          setList.push(all);
          data.forEach((set) => {
            all.count += set.repoNum;
            setList.push({name: set.setName, count: set.repoNum});
          });

          this.setState({ownerSetList: setList});
        }).bind(this));
    } else {
      this.setState({ownerSetList: [{name: 'All', count: 0}]});
    }

  }

  async getRepoList(owner, set, isLanguist) {
    if(isLanguist) {
      let url = '/api/repo/set';
      $.ajax(url, {data: {user: owner, setName: set}})
        .done(((repoList) => {
          console.log('repolist ' + repoList);
          this.setState({repoList: repoList, currentSet: set});
        }).bind(this))
        .fail(((xhr, status, err)=> {
          console.log(error);
        }).bind(this));
    } else {
      let url = '/api/user/starRepo';
      $.ajax(url, {data: {login: owner}})
        .done(((repoList)=> {
          this.setState({repoList: repoList, ownerSetList: [{name: 'All', count: repoList.length}]});
        }).bind(this))
    }
  }

  // Handle SetDialog
  handleOpenSetDialog() {
    this.setState({isSetDialogOpen: true});
  }

  handleCloseSetDialog(isSuccess) {
    if (isSuccess) {
      this.getSetList(this.state.user, this.state.owner);
    }
    this.setState({isSetDialogOpen: false});
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
      this.getSetList(this.state.user, this.state.owner);
      this.state.repoList.forEach((repo)=> {
        if(repo.full_name == this.state.currentStar) {
          repo.set = set;
        }
      });
      newState.repoList = this.state.repoList;
    }
    this.setState(newState);
  }

  // Handle Filter
  handleClickFilter(set) {
    if(this.state.isLanguist) {
      this.getRepoList(this.state.owner, set, this.state.isLanguist);
      this.setState({currentSet: set});
    }
  }

  render() {
    console.log('render StarPage');
    return (
      <div className="StarPage">
        <TitleBar text={(this.state.owner || 'Languist') + '\'s Starred'}/>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <RepoSetFilter
                data={this.state.ownerSetList}
                current={this.state.currentSet}
                handleClickAdd={this.handleOpenSetDialog.bind(this)}
                handleClickFilter={this.handleClickFilter.bind(this)}
                isCurrentUser={this.state.user == this.state.owner}/>
            </div>
            <div className={s.main}>
              <RepoList data={this.state.repoList} handleStar={this.handleOpenStarDialog.bind(this)}/>
            </div>
          </div>

        </div>
        <AddSetDialog isOpen={this.state.isSetDialogOpen} handleClose={this.handleCloseSetDialog.bind(this)}
                      user={this.state.user}/>
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

export default withStyles(StarPage, s);
