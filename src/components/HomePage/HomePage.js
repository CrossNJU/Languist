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
import StarDialog from '../StarDialog';

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
      currentRecommend: 0,
      hasMore: true,

      //Dialog
      isOpenDialog: false,
      addLang: '',

      // Star dialog
      isStarDialogOpen: false,
      currentStar: 'facebook/react',
      setList: []
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

    // Get flowList
    url = '/api/home/flowList?user=' + user;
    $.ajax(url)
    .done(((data) => {
      let unit = {
        title: 'Today',
        data: data
      }
      let list = this.state.flowList.slice();
      list.push(unit);
      this.setState({flowList: list});
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));

    this.getSetList(user);
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

  // Add langauge dialog
  handleAddLanguage(language) {
    this.setState({addLang: language, isOpenDialog: true});
  }

  handleDialogClose() {
    this.setState({addLang: '', isOpenDialog: false});
  }

  handleUnlike(param) {
    let url = `/api/rec/evaluate?login=${this.state.user}&name=${param.name}&type=${param.type}`;
    console.log('UNLIKE', url);
    $.ajax(url)
    .done(((data) => {
      console.log('UNLIKE', data);
      if (data.res === 1) {
        this.hideFlowItem(param);
      }
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  hideFlowItem(param) {
    let types = ['user', 'repo', 'lang'];
    let type = types[param.type];
    let list = this.state.flowList.slice();
    list.forEach((unit) => {
      let data = unit.data;
      let index = -1;
      data.forEach((item) => {
        if (item.type === type) {
          switch (param.type) {
            case 0:
              if (item.login === param.name) {
                index = data.indexOf(item);
              }
              break;
            case 1:
              if (item.full_name === param.name) {
                index = data.indexOf(item);
              }
              break;
            case 2:
              if (item.name === param.name) {
                index = data.indexOf(item);
              }
              break;
            default:
          }
        }
        console.log('UNLIKE', index);
      })
      data = data.splice(index, 1);
    });
    this.setState({flowList: list});
  }

  handleFollow(follow) {
    let user = this.state.user;
    let url = `/api/user/follow?user=${user}&follow=${follow}`;
    console.log('###',url);
    $.ajax(url)
      .done(((data) => {
        console.log("$$$",data);
        if (data.res === 1) {
          this.setFollowing(follow);
        }
      }).bind(this))
      .fail(((xhr, status, err) => {
        console.error(url, status, err.toString());
      }).bind(this));
  }

  handleUnfollow(user) {
    console.log('UNFOLLOWING', user);
  }

  handleUnstar(repo) {
    console.log('UNSTARRING', repo);
  }

  setFollowing(follow) {
    let list = this.state.flowList.slice();
    list.forEach((unit) => {
      let data = unit.data;
      data.forEach((item) => {
        if (item.type === 'user' && item.login === follow) {
          item.isFollowing = true;
        }
      })
    });
    this.setState({flowList: list});
  }

  handleLoad() {
    let recommendCount = this.state.currentRecommend;
    recommendCount--;
    let today = new Date();
    let day = new Date(today);
    day.setDate(today.getDate() + recommendCount);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let title = day.toLocaleDateString('en-US', options);

    const url = `/api/recommend/more?login=${this.state.user}&times=${recommendCount}`;
    console.log(url);
    $.ajax(url)
    .done(((data) => {
      if (data.length > 0) {
        let unit = {
          title: recommendCount === -1 ? 'Yesterday' : title,
          data: data
        }
        let list = this.state.flowList.slice();
        list.push(unit);
        this.setState({flowList: list, currentRecommend: recommendCount});
      } else {
        this.setState({hasMore: false});
      }
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
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
      this.state.flowList.forEach((data) => {
        data.data.forEach((repo)=> {
          if(repo.type == 'repo' && repo.full_name == this.state.currentStar) {
            repo.set = set;
          }
        });
      });
      newState.flowList = this.state.flowList;
    }
    this.setState(newState);
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
              <FlowList
                user={this.state.user}
                data={this.state.flowList}
                hasMore={this.state.hasMore}
                handleAddLanguage={this.handleAddLanguage.bind(this)}
                handleUnlike={this.handleUnlike.bind(this)}
                handleLoad={this.handleLoad.bind(this)}
                handleStar={this.handleOpenStarDialog.bind(this)}
                handleFollow={this.handleFollow.bind(this)}
                handleUnfollow={this.handleUnfollow.bind(this)}
                handleUnstar={this.handleUnstar.bind(this)}
              />
            </div>
          </div>
        </div>
        <AddLanguageDialog
          isOpen={this.state.isOpenDialog}
          language={{name: this.state.addLang, isSelected: true, level: 0}}
          user={this.state.user}
          handleClose={this.handleDialogClose.bind(this)}/>
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

export default withStyles(HomePage, s);
