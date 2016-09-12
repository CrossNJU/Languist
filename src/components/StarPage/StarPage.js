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
      currentSet: 'All',
      repoList: [],

      // Add set dialog
      isSetDialogOpen: false,

      // Star dialog
      isStarDialogOpen: true
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
    try {
      // const user = await $.ajax('/api/current_user');
      const user = 'RickChem';
      this.getSetList(user);
      this.getRepoList(user, 'All');
      this.setState({user: user});
    } catch (err) {
      console.error(err);
    }
  }

  async getSetList(user) {
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

  async getRepoList(user, set) {
    let url = '/api/repo/set';
    $.ajax(url, {data: {user: user, setName: set}})
      .done(((repoList) => {
        console.log('repolist ' + repoList);
        this.setState({repoList: repoList, currentSet: set});
      }).bind(this))
      .fail(((xhr, status, err)=> {
        console.log(error);
      }).bind(this));
  }

  // Handle SetDialog
  handleOpenSetDialog() {
    this.setState({isSetDialogOpen: true});
  }

  handleCloseSetDialog(isSuccess) {
    if (isSuccess) {
      this.getSetList(this.state.user);
    }
    this.setState({isSetDialogOpen: false});
  }

  // Handle StarDialog
  handleOpenStarDialog() {
    this.setState({isStarDialogOpen: true});
  }

  handleCloseStarDialog(isSuccess) {
    if (isSuccess) {
      this.getSetList(this.state.user);
    }
    this.setState({isStarDialogOpen: false});
  }

  // Handle Filter
  handleClickFilter(set) {
    this.getRepoList(this.state.user, set);
    this.setState({currentSet: set});
  }

  render() {
    console.log('render StarPage');
    return (
      <div className="StarPage">
        <TitleBar text={this.state.user + '\'s Starred'}/>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <RepoSetFilter
                data={this.state.setList}
                current={this.state.currentSet}
                handleClickAdd={this.handleOpenSetDialog.bind(this)}
                handleClickFilter={this.handleClickFilter.bind(this)}/>
            </div>
            <div className={s.main}>
              <RepoList data={this.state.repoList}/>
            </div>
          </div>

        </div>
        <AddSetDialog isOpen={this.state.isSetDialogOpen} handleClose={this.handleCloseSetDialog.bind(this)}
                      user={this.state.user}/>
        <StarDialog isOpen={this.state.isStarDialogOpen}
                    setList={this.state.setList.filter((set)=> {
                      return set.name != 'All'
                    })}
                    handleClose={this.handleCloseStarDialog.bind(this)}
                    repo = 'facebook/react'
                    user="RickChem"/>
      </div>
    );
  }
}

export default withStyles(StarPage, s);
