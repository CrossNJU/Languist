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
import s from './HomePage.scss';
import Cover from '../Cover';
import Count from '../Count';
import LanguageList from '../LanguageList';
import RepoList from '../RepoList';
import FlowList from '../FlowList';
import AddLanguageDialog from '../AddLanguageDialog';

const title = 'Home';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      count: {
        followingCount: 0,
        followersCount: 0,
        starredCount: 0
      },
      cover: {
        avatar_rul: '',
        name: 'Languist',
        langs: 0
      },
      repoList: [],
      flowList: [],
      langList: [],

      //Dialog
      isOpenDialog: false,
      addLang: '',
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    console.log('componentDidMount');

    try {
      // Get username
      const user = await $.ajax('/api/current_user');
      console.log('Current user is', user);

      if(user) {
        // Get other data
        await this.loadData(user);
      } else {
        window.location.href = '/login';
      }

      this.setState({user: user});

    } catch(err) {
      console.error(err);
    }

    // const user = 'RickChem';
    // this.loadData(user);
  }

  loadData(user) {
    let url = '/api/home/';
    let isHaveLanguage = true;

    // Get langList
    url = '/api/home/langList?user=' + user;
    $.ajax(url)
      .done(((data) => {
        if(data && data.length != 0) {
          this.setState({langList: data});
        }else {
          window.location.href = '/language';
        }
      }).bind(this))
      .fail(((xhr, status, err) => {
        console.error(url, status, err.toString());
      }).bind(this));

    // if(!isHaveLanguage) {
    //   return ;
    // }

    // Get count
    url = '/api/home/count?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({count: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    // Get cover
    url = '/api/home/cover?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({cover: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    // Get repoList
    // url = '/api/home/repoList?user=' + user + '&lang=' + 'JavaScript';
    // $.ajax(url)
    // .done(((data) => {
    //   this.setState({repoList: data});
    // }).bind(this))
    // .fail(((xhr, status, err) => {
    //   console.error(url, status, err.toString());
    // }).bind(this));

    // Get flowList
    url = '/api/home/flowList?user=' + user;
    $.ajax(url)
    .done(((data) => {
      this.setState({flowList: data});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  // Add langauge dialog
  handleAddLanguage(language) {
    this.setState({addLang: language, isOpenDialog: true});
  };

  handleDialogClose() {
    this.setState({addLang: '', isOpenDialog: false});
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  render() {
    console.log('render HomePage');
    return (
      <div className="HomePage">
        <Cover data={this.state.cover} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Count data={this.state.count} />
              <LanguageList data={this.state.langList} />
            </div>
            <div className={s.main}>
              <FlowList data={this.state.flowList} handleAddLangauge={this.handleAddLanguage.bind(this)}/>
            </div>
          </div>
        </div>
        <AddLanguageDialog
          isOpen={this.state.isOpenDialog}
          language={{name: this.state.addLang, isSelected: true, level: 0}}
          user={this.state.user}
          handleClose={this.handleDialogClose.bind(this)}/>
      </div>
    );
  }
}

export default withStyles(HomePage, s);
